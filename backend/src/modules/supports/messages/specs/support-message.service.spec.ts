import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SupportMessageService } from '../support-message.service.js';
import { SupportMessage } from '../schema/support-message.schema.js';
import { SupportConversation } from '../../coversations/schema/support-conversation.schema.js';
import { User } from '../../../users/schema/user.schema.js';
import { CloudinaryService } from '../../../../infrastructure/cloudinary/cloudinary.service.js';
import { SupportConversationStatus } from '../../../../common/enums/support-conversation.enum.js';
import { UserRole } from '../../../../common/enums/user.enum.js';
import { messages } from '../../../../common/libs/messages.js';

vi.mock('../../../../common/libs/response.js', () => ({
  response: vi.fn((data, message) => ({ data, message })),
}));

describe('SupportMessageService', () => {
  let service: SupportMessageService;

  const supportMessageModel = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    findByPk: vi.fn(),
    update: vi.fn(),
  };
  const supportConversationModel = { findByPk: vi.fn() };
  const cloudinaryService = { upload: vi.fn(), destroy: vi.fn() };

  const owner = { id: 'user-1', role: UserRole.CLIENT } as unknown as User;
  const stranger = { id: 'user-2', role: UserRole.CLIENT } as unknown as User;
  const staff = { id: 'staff-1', role: UserRole.SUPPORT } as unknown as User;
  const admin = { id: 'admin-1', role: UserRole.ADMIN } as unknown as User;

  const makeFile = (name: string) =>
    ({ originalname: name }) as Express.Multer.File;

  const makeConversation = (overrides: Record<string, unknown> = {}) => ({
    id: 'c1',
    userId: 'user-1',
    status: SupportConversationStatus.OPEN,
    lastMessage: null as string | null,
    lastMessageSenderId: null as string | null,
    save: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupportMessageService,
        {
          provide: getModelToken(SupportMessage),
          useValue: supportMessageModel,
        },
        {
          provide: getModelToken(SupportConversation),
          useValue: supportConversationModel,
        },
        { provide: CloudinaryService, useValue: cloudinaryService },
      ],
    }).compile();

    service = module.get(SupportMessageService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ───────────────────────── create ─────────────────────────
  describe('create', () => {
    it('should throw NotFoundException if conversation not found', async () => {
      supportConversationModel.findByPk.mockResolvedValue(null);

      await expect(service.create(owner, 'c1', 'hi')).rejects.toThrow(
        new NotFoundException(messages.supportConversation.notFound),
      );
    });

    it('should hide the conversation (NotFound) from a user who does not own it', async () => {
      supportConversationModel.findByPk.mockResolvedValue(makeConversation());

      await expect(service.create(stranger, 'c1', 'hi')).rejects.toThrow(
        new NotFoundException(messages.supportConversation.notFound),
      );
      expect(supportMessageModel.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if the conversation is closed', async () => {
      supportConversationModel.findByPk.mockResolvedValue(
        makeConversation({ status: SupportConversationStatus.CLOSED }),
      );

      await expect(service.create(owner, 'c1', 'hi')).rejects.toThrow(
        new BadRequestException(messages.supportConversation.closed),
      );
    });

    it('should throw BadRequestException if more than 5 files are sent', async () => {
      supportConversationModel.findByPk.mockResolvedValue(makeConversation());
      const files = Array.from({ length: 6 }, (_, i) => makeFile(`f${i}.png`));

      await expect(service.create(owner, 'c1', 'hi', files)).rejects.toThrow(
        new BadRequestException(messages.supportMessage.create.maxAttachments),
      );
      expect(cloudinaryService.upload).not.toHaveBeenCalled();
    });

    it.each([[null], ['   ']])(
      'should throw BadRequestException when message is %p and no files',
      async (message) => {
        supportConversationModel.findByPk.mockResolvedValue(makeConversation());

        await expect(service.create(owner, 'c1', message, [])).rejects.toThrow(
          new BadRequestException(messages.supportMessage.create.empty),
        );
      },
    );

    it('should upload files, save the message and update the conversation last message', async () => {
      const conversation = makeConversation();
      const fullMessage = { id: 'm1', sender: { id: 'user-1' } };
      supportConversationModel.findByPk.mockResolvedValue(conversation);
      cloudinaryService.upload
        .mockResolvedValueOnce({ url: 'url-1', publicId: 'p1' })
        .mockResolvedValueOnce({ url: 'url-2', publicId: 'p2' });
      supportMessageModel.create.mockResolvedValue({ id: 'm1' });
      supportMessageModel.findByPk.mockResolvedValue(fullMessage);
      const files = [makeFile('a.png'), makeFile('b.png')];

      const result = await service.create(owner, 'c1', '  hello  ', files);

      expect(cloudinaryService.upload).toHaveBeenCalledWith(
        files[0],
        'support-messages/attachments',
      );
      expect(supportMessageModel.create).toHaveBeenCalledWith({
        conversationId: 'c1',
        senderId: 'user-1',
        message: 'hello',
        attachments: ['url-1', 'url-2'],
      });
      expect(conversation.lastMessage).toBe('hello');
      expect(conversation.lastMessageSenderId).toBe('user-1');
      expect(conversation.save).toHaveBeenCalled();
      expect(supportMessageModel.findByPk).toHaveBeenCalledWith(
        'm1',
        expect.objectContaining({ include: expect.any(Array) }),
      );
      expect(result).toEqual({
        data: fullMessage,
        message: messages.supportMessage.create.success,
      });
    });

    it('should accept exactly 5 files', async () => {
      supportConversationModel.findByPk.mockResolvedValue(makeConversation());
      cloudinaryService.upload.mockResolvedValue({ url: 'u', publicId: 'p' });
      supportMessageModel.create.mockResolvedValue({ id: 'm1' });
      supportMessageModel.findByPk.mockResolvedValue({ id: 'm1' });
      const files = Array.from({ length: 5 }, (_, i) => makeFile(`f${i}.png`));

      await service.create(owner, 'c1', null, files);

      expect(cloudinaryService.upload).toHaveBeenCalledTimes(5);
    });

    it('should store null message and use "Attachment" as last message when only files are sent', async () => {
      const conversation = makeConversation();
      supportConversationModel.findByPk.mockResolvedValue(conversation);
      cloudinaryService.upload.mockResolvedValue({ url: 'u', publicId: 'p' });
      supportMessageModel.create.mockResolvedValue({ id: 'm1' });
      supportMessageModel.findByPk.mockResolvedValue({ id: 'm1' });

      await service.create(owner, 'c1', null, [makeFile('a.png')]);

      expect(supportMessageModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ message: null, attachments: ['u'] }),
      );
      expect(conversation.lastMessage).toBe('Attachment');
    });

    it.each([
      ['support', staff],
      ['admin', admin],
    ])(
      'should let %s staff reply in any conversation',
      async (_label, user) => {
        const conversation = makeConversation();
        supportConversationModel.findByPk.mockResolvedValue(conversation);
        supportMessageModel.create.mockResolvedValue({ id: 'm1' });
        supportMessageModel.findByPk.mockResolvedValue({ id: 'm1' });

        await service.create(user, 'c1', 'We are here to help');

        expect(supportMessageModel.create).toHaveBeenCalledWith(
          expect.objectContaining({ senderId: user.id }),
        );
        expect(conversation.lastMessageSenderId).toBe(user.id);
      },
    );
  });

  // ───────────────────────── findAll ─────────────────────────
  describe('findAll', () => {
    it('should throw NotFoundException if conversation not found', async () => {
      supportConversationModel.findByPk.mockResolvedValue(null);

      await expect(service.findAll(owner, 'c1')).rejects.toThrow(
        new NotFoundException(messages.supportConversation.notFound),
      );
    });

    it('should throw NotFoundException if the user does not own the conversation', async () => {
      supportConversationModel.findByPk.mockResolvedValue(makeConversation());

      await expect(service.findAll(stranger, 'c1')).rejects.toThrow(
        new NotFoundException(messages.supportConversation.notFound),
      );
      expect(supportMessageModel.findAll).not.toHaveBeenCalled();
    });

    it('should return the messages of the conversation ordered ASC', async () => {
      const list = [{ id: 'm1' }, { id: 'm2' }];
      supportConversationModel.findByPk.mockResolvedValue(makeConversation());
      supportMessageModel.findAll.mockResolvedValue(list);

      const result = await service.findAll(owner, 'c1');

      expect(supportMessageModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { conversationId: 'c1' },
          order: [['createdAt', 'ASC']],
        }),
      );
      expect(result).toEqual({ data: list, message: null });
    });

    it('should let staff read any conversation', async () => {
      supportConversationModel.findByPk.mockResolvedValue(makeConversation());
      supportMessageModel.findAll.mockResolvedValue([]);

      await expect(service.findAll(staff, 'c1')).resolves.toBeDefined();
    });
  });

  // ───────────────────────── markAllAsRead ─────────────────────────
  describe('markAllAsRead', () => {
    it('should throw NotFoundException if conversation not found', async () => {
      supportConversationModel.findByPk.mockResolvedValue(null);

      await expect(service.markAllAsRead(owner, 'c1')).rejects.toThrow(
        new NotFoundException(messages.supportConversation.notFound),
      );
    });

    it('should throw NotFoundException if the user does not own the conversation', async () => {
      supportConversationModel.findByPk.mockResolvedValue(makeConversation());

      await expect(service.markAllAsRead(stranger, 'c1')).rejects.toThrow(
        new NotFoundException(messages.supportConversation.notFound),
      );
      expect(supportMessageModel.update).not.toHaveBeenCalled();
    });

    it('should mark all unread messages of the conversation as read', async () => {
      supportConversationModel.findByPk.mockResolvedValue(makeConversation());
      supportMessageModel.update.mockResolvedValue([3]);

      const result = await service.markAllAsRead(owner, 'c1');

      expect(supportMessageModel.update).toHaveBeenCalledWith(
        { isRead: true },
        { where: { conversationId: 'c1', isRead: false } },
      );
      expect(result).toEqual({
        data: [3],
        message: messages.supportMessage.markAsRead.success,
      });
    });
  });

  // ───────────────────────── destroy ─────────────────────────
  describe('destroy', () => {
    it('should throw NotFoundException if message not found', async () => {
      supportMessageModel.findOne.mockResolvedValue(null);

      await expect(service.destroy('c1', 'm1')).rejects.toThrow(
        new NotFoundException(messages.supportMessage.notFound),
      );
      expect(supportMessageModel.findOne).toHaveBeenCalledWith({
        where: { id: 'm1', conversationId: 'c1' },
      });
    });

    it('should remove every attachment from cloudinary and destroy the message', async () => {
      const message = {
        attachments: ['att-1', 'att-2'],
        destroy: vi.fn().mockResolvedValue(undefined),
      };
      supportMessageModel.findOne.mockResolvedValue(message);

      const result = await service.destroy('c1', 'm1');

      expect(cloudinaryService.destroy).toHaveBeenCalledTimes(2);
      expect(cloudinaryService.destroy).toHaveBeenCalledWith('att-1');
      expect(cloudinaryService.destroy).toHaveBeenCalledWith('att-2');
      expect(message.destroy).toHaveBeenCalled();
      expect(result).toEqual({
        data: null,
        message: messages.supportMessage.destroy.success,
      });
    });

    it('should destroy a message without attachments without touching cloudinary', async () => {
      const message = {
        attachments: [],
        destroy: vi.fn().mockResolvedValue(undefined),
      };
      supportMessageModel.findOne.mockResolvedValue(message);

      await service.destroy('c1', 'm1');

      expect(cloudinaryService.destroy).not.toHaveBeenCalled();
      expect(message.destroy).toHaveBeenCalled();
    });
  });
});

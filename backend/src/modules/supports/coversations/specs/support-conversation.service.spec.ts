import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SupportConversationService } from '../support-conversation.service.js';
import { SupportConversation } from '../schema/support-conversation.schema.js';
import { User } from '../../../users/schema/user.schema.js';
import { SupportConversationStatus } from '../../../../common/enums/support-conversation.enum.js';
import { UserRole } from '../../../../common/enums/user.enum.js';
import { messages } from '../../../../common/libs/messages.js';

vi.mock('../../../../common/libs/response.js', () => ({
  response: vi.fn((data, message) => ({ data, message })),
}));

describe('SupportConversationService', () => {
  let service: SupportConversationService;

  const supportConversationModel = {
    findOne: vi.fn(),
    findAll: vi.fn(),
    findByPk: vi.fn(),
    findAndCountAll: vi.fn(),
    create: vi.fn(),
  };
  const userModel = { findByPk: vi.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupportConversationService,
        {
          provide: getModelToken(SupportConversation),
          useValue: supportConversationModel,
        },
        { provide: getModelToken(User), useValue: userModel },
      ],
    }).compile();

    service = module.get(SupportConversationService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ───────────────────────── create ─────────────────────────
  describe('create', () => {
    it('should throw BadRequestException if the user already has an open conversation', async () => {
      supportConversationModel.findOne.mockResolvedValue({ id: 'c1' });

      await expect(service.create('user-1')).rejects.toThrow(
        new BadRequestException(messages.supportConversation.alreadyOpen),
      );
      expect(supportConversationModel.findOne).toHaveBeenCalledWith({
        where: { userId: 'user-1', status: SupportConversationStatus.OPEN },
      });
      expect(userModel.findByPk).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if the user does not exist', async () => {
      supportConversationModel.findOne.mockResolvedValue(null);
      userModel.findByPk.mockResolvedValue(null);

      await expect(service.create('user-1')).rejects.toThrow(
        new NotFoundException(messages.user.notFound),
      );
      expect(supportConversationModel.create).not.toHaveBeenCalled();
    });

    it('should create an OPEN conversation', async () => {
      const conversation = { id: 'c1' };
      supportConversationModel.findOne.mockResolvedValue(null);
      userModel.findByPk.mockResolvedValue({ id: 'user-1' });
      supportConversationModel.create.mockResolvedValue(conversation);

      const result = await service.create('user-1');

      expect(supportConversationModel.create).toHaveBeenCalledWith({
        userId: 'user-1',
        status: SupportConversationStatus.OPEN,
      });
      expect(result).toEqual({
        data: conversation,
        message: messages.supportConversation.create.success,
      });
    });
  });

  // ───────────────────────── findMe ─────────────────────────
  describe('findMe', () => {
    it("should return the user's conversations ordered by updatedAt DESC", async () => {
      const list = [{ id: 'c1' }];
      supportConversationModel.findAll.mockResolvedValue(list);

      const result = await service.findMe('user-1');

      expect(supportConversationModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-1' },
          order: [['updatedAt', 'DESC']],
        }),
      );
      expect(result).toEqual({ data: list, message: null });
    });
  });

  // ───────────────────────── findOne ─────────────────────────
  describe('findOne', () => {
    it('should throw NotFoundException if the current user does not exist', async () => {
      userModel.findByPk.mockResolvedValue(null);

      await expect(service.findOne('user-1', 'c1')).rejects.toThrow(
        new NotFoundException(messages.user.notFound),
      );
    });

    it.each([UserRole.ADMIN, UserRole.SUPPORT])(
      'should let %s staff open any conversation (no userId filter)',
      async (role) => {
        const conversation = { id: 'c1' };
        userModel.findByPk.mockResolvedValue({ id: 'staff-1', role });
        supportConversationModel.findOne.mockResolvedValue(conversation);

        const result = await service.findOne('staff-1', 'c1');

        expect(supportConversationModel.findOne).toHaveBeenCalledWith(
          expect.objectContaining({ where: { id: 'c1' } }),
        );
        expect(result).toEqual({ data: conversation, message: null });
      },
    );

    it('should restrict regular users to their own conversations', async () => {
      userModel.findByPk.mockResolvedValue({
        id: 'user-1',
        role: UserRole.CLIENT,
      });
      supportConversationModel.findOne.mockResolvedValue({ id: 'c1' });

      await service.findOne('user-1', 'c1');

      expect(supportConversationModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'c1', userId: 'user-1' } }),
      );
    });

    it('should throw NotFoundException if the conversation is not found', async () => {
      userModel.findByPk.mockResolvedValue({
        id: 'user-1',
        role: UserRole.CLIENT,
      });
      supportConversationModel.findOne.mockResolvedValue(null);

      await expect(service.findOne('user-1', 'c1')).rejects.toThrow(
        new NotFoundException(messages.supportConversation.notFound),
      );
    });
  });

  // ───────────────────────── findAll ─────────────────────────
  describe('findAll', () => {
    it('should paginate and return pagination info', async () => {
      const rows = [{ id: 'c1' }];
      supportConversationModel.findAndCountAll.mockResolvedValue({
        rows,
        count: 25,
      });

      const result = await service.findAll(2, 10);

      expect(supportConversationModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 10,
          offset: 10,
          order: [['updatedAt', 'DESC']],
        }),
      );
      expect(result).toEqual({
        data: {
          conversations: rows,
          pagination: {
            page: 2,
            limit: 10,
            total: 25,
            totalPages: 3,
            hasNextPage: true,
            hasPreviousPage: true,
          },
        },
        message: null,
      });
    });

    it('should use default page=1 and limit=10', async () => {
      supportConversationModel.findAndCountAll.mockResolvedValue({
        rows: [],
        count: 0,
      });

      await service.findAll();

      expect(supportConversationModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 10, offset: 0 }),
      );
    });
  });

  // ───────────────────────── toggle ─────────────────────────
  describe('toggle', () => {
    const makeConversation = (status: SupportConversationStatus) => ({
      id: 'c1',
      status,
      closedAt: null as Date | null,
      closedBy: null as string | null,
      save: vi.fn().mockResolvedValue(undefined),
    });

    it('should throw NotFoundException if the conversation is not found', async () => {
      supportConversationModel.findByPk.mockResolvedValue(null);

      await expect(service.toggle('admin-1', 'c1')).rejects.toThrow(
        new NotFoundException(messages.supportConversation.notFound),
      );
    });

    it('should close an OPEN conversation and record who closed it', async () => {
      const conversation = makeConversation(SupportConversationStatus.OPEN);
      supportConversationModel.findByPk.mockResolvedValue(conversation);

      const result = await service.toggle('admin-1', 'c1');

      expect(conversation.status).toBe(SupportConversationStatus.CLOSED);
      expect(conversation.closedAt).toBeInstanceOf(Date);
      expect(conversation.closedBy).toBe('admin-1');
      expect(conversation.save).toHaveBeenCalled();
      expect(result).toEqual({
        data: conversation,
        message: messages.supportConversation.close.success,
      });
    });

    it('should reopen a CLOSED conversation and clear closing info', async () => {
      const conversation = makeConversation(SupportConversationStatus.CLOSED);
      conversation.closedAt = new Date();
      conversation.closedBy = 'admin-1';
      supportConversationModel.findByPk.mockResolvedValue(conversation);

      const result = await service.toggle('admin-2', 'c1');

      expect(conversation.status).toBe(SupportConversationStatus.OPEN);
      expect(conversation.closedAt).toBeNull();
      expect(conversation.closedBy).toBeNull();
      expect(conversation.save).toHaveBeenCalled();
      expect(result).toEqual({
        data: conversation,
        message: messages.supportConversation.open.success,
      });
    });
  });
});

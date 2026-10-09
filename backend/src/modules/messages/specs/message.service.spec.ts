import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { MessageService } from '../message.service.js';
import { Message } from '../schema/message.schema.js';
import { Contract } from '../../contracts/schema/contract.schema.js';
import { User } from '../../users/schema/user.schema.js';
import { CloudinaryService } from '../../../infrastructure/cloudinary/cloudinary.service.js';
import { NotificationService } from '../../notifications/notification.service.js';
import { MessageGateway } from '../../../infrastructure/gateways/message.gateway.js';
import { messages } from '../../../common/libs/messages.js';
import { ContractStatus } from '../../../common/enums/contract.enum.js';
import { UserRole } from '../../../common/enums/user.enum.js';
import { NotificationType } from '../../../common/enums/notification.enum.js';
import { assertOwnerOrAdmin } from '../../../common/libs/assert-owner-or-admin.js';

vi.mock('../../../common/libs/response.js', () => ({
  response: vi.fn((data, message) => ({ data, message })),
}));

vi.mock('../../../common/libs/assert-owner-or-admin.js', () => ({
  assertOwnerOrAdmin: vi.fn(),
}));

describe('MessageService', () => {
  let service: MessageService;

  const messageModel = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    findAndCountAll: vi.fn(),
  };
  const contractModel = { findOne: vi.fn() };
  const cloudinaryService = { upload: vi.fn(), destroy: vi.fn() };
  const notificationService = { create: vi.fn() };
  const messageGateway = {
    sendMessage: vi.fn(),
    sendMessageDeleted: vi.fn(),
  };

  const makeFile = (name: string) =>
    ({ originalname: name }) as Express.Multer.File;

  const makeContract = (overrides: Record<string, unknown> = {}) => ({
    id: 'contract-1',
    clientId: 'client-1',
    status: ContractStatus.IN_PROGRESS,
    freelancer: { id: 'freelancer-1', userId: 'freelancer-user-1' },
    ...overrides,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        { provide: getModelToken(Message), useValue: messageModel },
        { provide: getModelToken(Contract), useValue: contractModel },
        { provide: CloudinaryService, useValue: cloudinaryService },
        { provide: NotificationService, useValue: notificationService },
        { provide: MessageGateway, useValue: messageGateway },
      ],
    }).compile();

    service = module.get(MessageService);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // ───────────────────────── create ─────────────────────────
  describe('create', () => {
    it('should throw NotFoundException if contract not found', async () => {
      contractModel.findOne.mockResolvedValue(null);

      await expect(
        service.create('client-1', 'contract-1', 'hello'),
      ).rejects.toThrow(new NotFoundException(messages.contract.notFound));
      expect(messageModel.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if contract is not IN_PROGRESS', async () => {
      contractModel.findOne.mockResolvedValue(
        makeContract({ status: ContractStatus.COMPLETED }),
      );

      await expect(
        service.create('client-1', 'contract-1', 'hello'),
      ).rejects.toThrow(
        new BadRequestException(messages.message.contractClosed),
      );
    });

    it('should throw BadRequestException if content is blank and no images', async () => {
      contractModel.findOne.mockResolvedValue(makeContract());

      await expect(
        service.create('client-1', 'contract-1', '   ', []),
      ).rejects.toThrow(new BadRequestException(messages.message.empty));
      expect(cloudinaryService.upload).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if content is null and no images', async () => {
      contractModel.findOne.mockResolvedValue(makeContract());

      await expect(
        service.create('client-1', 'contract-1', null),
      ).rejects.toThrow(new BadRequestException(messages.message.empty));
    });

    it('should upload images, create message, notify freelancer and emit socket event when sender is the client', async () => {
      const message = { id: 'msg-1' };
      contractModel.findOne.mockResolvedValue(makeContract());
      cloudinaryService.upload
        .mockResolvedValueOnce({ url: 'u1', publicId: 'p1' })
        .mockResolvedValueOnce({ url: 'u2', publicId: 'p2' });
      messageModel.create.mockResolvedValue(message);
      const images = [makeFile('a.png'), makeFile('b.png')];

      const result = await service.create(
        'client-1',
        'contract-1',
        '  hi there  ',
        images,
      );

      expect(cloudinaryService.upload).toHaveBeenCalledTimes(2);
      expect(cloudinaryService.upload).toHaveBeenNthCalledWith(
        1,
        images[0],
        'messages',
      );
      expect(messageModel.create).toHaveBeenCalledWith({
        contractId: 'contract-1',
        senderId: 'client-1',
        content: 'hi there',
        images: [
          { url: 'u1', publicId: 'p1' },
          { url: 'u2', publicId: 'p2' },
        ],
      });
      expect(notificationService.create).toHaveBeenCalledWith({
        senderId: 'client-1',
        receiverId: 'freelancer-user-1',
        targetId: 'msg-1',
        type: NotificationType.CONTRACT_MESSAGE,
        message: 'You have a new message.',
        link: '/contract/contract-1',
      });
      expect(messageGateway.sendMessage).toHaveBeenCalledWith({
        receiverId: 'freelancer-user-1',
        message,
      });
      expect(result).toEqual({
        data: message,
        message: messages.message.create.success,
      });
    });

    it('should send to the client when sender is the freelancer', async () => {
      contractModel.findOne.mockResolvedValue(makeContract());
      messageModel.create.mockResolvedValue({ id: 'msg-2' });

      await service.create('freelancer-user-1', 'contract-1', 'hello');

      expect(notificationService.create).toHaveBeenCalledWith(
        expect.objectContaining({ receiverId: 'client-1' }),
      );
      expect(messageGateway.sendMessage).toHaveBeenCalledWith(
        expect.objectContaining({ receiverId: 'client-1' }),
      );
    });

    it('should allow an images-only message and store content as null', async () => {
      contractModel.findOne.mockResolvedValue(makeContract());
      cloudinaryService.upload.mockResolvedValue({ url: 'u1', publicId: 'p1' });
      messageModel.create.mockResolvedValue({ id: 'msg-3' });

      await service.create('client-1', 'contract-1', null, [makeFile('a.png')]);

      expect(messageModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          content: null,
          images: [{ url: 'u1', publicId: 'p1' }],
        }),
      );
    });
  });

  // ───────────────────────── findAll ─────────────────────────
  describe('findAll', () => {
    it('should paginate and return pagination info', async () => {
      const rows = [{ id: 'm1' }];
      messageModel.findAndCountAll.mockResolvedValue({ rows, count: 45 });

      const result = await service.findAll(2, 20);

      expect(messageModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 20,
          offset: 20,
          order: [['createdAt', 'DESC']],
        }),
      );
      expect(result).toEqual({
        data: {
          messages: rows,
          pagination: {
            page: 2,
            limit: 20,
            total: 45,
            totalPages: 3,
            hasNextPage: true,
            hasPreviousPage: true,
          },
        },
        message: null,
      });
    });

    it('should use default page=1 and limit=20', async () => {
      messageModel.findAndCountAll.mockResolvedValue({ rows: [], count: 5 });

      const result = await service.findAll();

      expect(messageModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 20, offset: 0 }),
      );
      expect(result.data.pagination).toEqual(
        expect.objectContaining({
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        }),
      );
    });
  });

  // ───────────────────────── findMe ─────────────────────────
  describe('findMe', () => {
    it('should throw NotFoundException if contract not found', async () => {
      contractModel.findOne.mockResolvedValue(null);

      await expect(service.findMe('user-1', 'contract-1')).rejects.toThrow(
        new NotFoundException(messages.contract.notFound),
      );
      expect(messageModel.findAll).not.toHaveBeenCalled();
    });

    it('should return contract messages ordered ASC', async () => {
      const list = [{ id: 'm1' }, { id: 'm2' }];
      contractModel.findOne.mockResolvedValue(makeContract());
      messageModel.findAll.mockResolvedValue(list);

      const result = await service.findMe('client-1', 'contract-1');

      expect(messageModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { contractId: 'contract-1' },
          order: [['createdAt', 'ASC']],
        }),
      );
      expect(result).toEqual({ data: list, message: null });
    });
  });

  // ───────────────────────── destroy ─────────────────────────
  describe('destroy', () => {
    const admin = { id: 'admin-1', role: UserRole.ADMIN } as unknown as User;
    const nonAdminRole = Object.values(UserRole).find(
      (r) => r !== UserRole.ADMIN,
    );
    const owner = { id: 'client-1', role: nonAdminRole } as unknown as User;

    const makeMessage = (overrides: Record<string, unknown> = {}) => ({
      id: 'msg-1',
      sender: { id: 'client-1' },
      images: [{ publicId: 'p1' }, { publicId: 'p2' }],
      contract: {
        status: ContractStatus.IN_PROGRESS,
        clientId: 'client-1',
        freelancer: { userId: 'freelancer-user-1' },
      },
      destroy: vi.fn().mockResolvedValue(undefined),
      ...overrides,
    });

    it('should throw NotFoundException if message not found', async () => {
      messageModel.findOne.mockResolvedValue(null);

      await expect(service.destroy(owner, 'msg-1')).rejects.toThrow(
        new NotFoundException(messages.message.notFound),
      );
    });

    it('should propagate the error if user is not owner nor admin', async () => {
      messageModel.findOne.mockResolvedValue(makeMessage());
      (assertOwnerOrAdmin as Mock).mockImplementation(() => {
        throw new ForbiddenException(messages.message.forbidden);
      });
      const stranger = { id: 'other', role: nonAdminRole } as unknown as User;

      await expect(service.destroy(stranger, 'msg-1')).rejects.toThrow(
        ForbiddenException,
      );
      expect(assertOwnerOrAdmin).toHaveBeenCalledWith({
        ownerId: 'client-1',
        currentUser: stranger,
        message: messages.message.forbidden,
      });
    });

    it('should throw BadRequestException if contract is closed (non-admin)', async () => {
      const msg = makeMessage({
        contract: {
          status: ContractStatus.COMPLETED,
          clientId: 'client-1',
          freelancer: { userId: 'freelancer-user-1' },
        },
      });
      messageModel.findOne.mockResolvedValue(msg);

      await expect(service.destroy(owner, 'msg-1')).rejects.toThrow(
        new BadRequestException(messages.message.contractClosed),
      );
      expect(msg.destroy).not.toHaveBeenCalled();
    });

    it('should delete images, destroy message and notify the freelancer when the sender is the client', async () => {
      const msg = makeMessage();
      messageModel.findOne.mockResolvedValue(msg);

      const result = await service.destroy(owner, 'msg-1');

      expect(cloudinaryService.destroy).toHaveBeenCalledTimes(2);
      expect(cloudinaryService.destroy).toHaveBeenCalledWith('p1');
      expect(cloudinaryService.destroy).toHaveBeenCalledWith('p2');
      expect(msg.destroy).toHaveBeenCalled();
      expect(messageGateway.sendMessageDeleted).toHaveBeenCalledWith({
        receiverId: 'freelancer-user-1',
        messageId: 'msg-1',
      });
      expect(result).toEqual({
        data: msg,
        message: messages.message.destroy.success,
      });
    });

    it('should notify the client when the sender is the freelancer', async () => {
      const msg = makeMessage({ sender: { id: 'freelancer-user-1' } });
      messageModel.findOne.mockResolvedValue(msg);
      const freelancerUser = {
        id: 'freelancer-user-1',
        role: nonAdminRole,
      } as unknown as User;

      await service.destroy(freelancerUser, 'msg-1');

      expect(messageGateway.sendMessageDeleted).toHaveBeenCalledWith({
        receiverId: 'client-1',
        messageId: 'msg-1',
      });
    });

    it('should let admin delete without ownership or contract-status checks', async () => {
      const msg = makeMessage({
        contract: {
          status: ContractStatus.COMPLETED,
          clientId: 'client-1',
          freelancer: { userId: 'freelancer-user-1' },
        },
      });
      messageModel.findOne.mockResolvedValue(msg);

      const result = await service.destroy(admin, 'msg-1');

      expect(assertOwnerOrAdmin).not.toHaveBeenCalled();
      expect(msg.destroy).toHaveBeenCalled();
      expect(result.message).toBe(messages.message.destroy.success);
    });

    it('should not call cloudinary when the message has no images', async () => {
      const msg = makeMessage({ images: [] });
      messageModel.findOne.mockResolvedValue(msg);

      await service.destroy(admin, 'msg-1');

      expect(cloudinaryService.destroy).not.toHaveBeenCalled();
      expect(msg.destroy).toHaveBeenCalled();
    });
  });
});

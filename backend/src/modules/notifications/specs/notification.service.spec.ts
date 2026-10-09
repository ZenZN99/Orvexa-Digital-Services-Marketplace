import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException } from '@nestjs/common';
import { NotificationService } from '../notification.service.js';
import { Notification } from '../schema/notification.schema.js';
import { NotificationGateway } from '../../../infrastructure/gateways/notification.gateway.js';
import { messages } from '../../../common/libs/messages.js';
import { NotificationType } from '../../../common/enums/notification.enum.js';

vi.mock('../../../common/libs/response.js', () => ({
  response: vi.fn((data, message) => ({ data, message })),
}));

describe('NotificationService', () => {
  let service: NotificationService;

  const notificationModel = {
    create: vi.fn(),
    findByPk: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
  };
  const notificationGateway = {
    sendNotification: vi.fn(),
    sendMarkAsRead: vi.fn(),
    sendMarkAllAsRead: vi.fn(),
  };

  const receiverId = 'receiver-1';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        { provide: getModelToken(Notification), useValue: notificationModel },
        { provide: NotificationGateway, useValue: notificationGateway },
      ],
    }).compile();

    service = module.get(NotificationService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ───────────────────────── create ─────────────────────────
  describe('create', () => {
    const data = {
      senderId: 'sender-1',
      receiverId,
      targetId: 'target-1',
      type: NotificationType.PAYMENT,
      message: 'Hello',
      link: '/contract/1',
    } as any;

    it('should do nothing when sender and receiver are the same user', async () => {
      const result = await service.create({
        ...data,
        receiverId: 'sender-1',
      });

      expect(result).toBeUndefined();
      expect(notificationModel.create).not.toHaveBeenCalled();
      expect(notificationGateway.sendNotification).not.toHaveBeenCalled();
    });

    it('should create the notification, reload it with sender and emit it through the gateway', async () => {
      const json = { id: 'n1', message: 'Hello' };
      const loaded = { id: 'n1', toJSON: vi.fn().mockReturnValue(json) };
      notificationModel.create.mockResolvedValue({ id: 'n1' });
      notificationModel.findByPk.mockResolvedValue(loaded);

      const result = await service.create(data);

      expect(notificationModel.create).toHaveBeenCalledWith({
        senderId: 'sender-1',
        receiverId,
        targetId: 'target-1',
        type: NotificationType.PAYMENT,
        message: 'Hello',
        isRead: false,
        link: '/contract/1',
      });
      expect(notificationModel.findByPk).toHaveBeenCalledWith(
        'n1',
        expect.objectContaining({ include: expect.any(Array) }),
      );
      expect(notificationGateway.sendNotification).toHaveBeenCalledWith(json);
      expect(result).toEqual({ data: loaded, message: null });
    });
  });

  // ───────────────────────── findMe ─────────────────────────
  describe('findMe', () => {
    it("should return the receiver's notifications newest first", async () => {
      const list = [{ id: 'n1' }, { id: 'n2' }];
      notificationModel.findAll.mockResolvedValue(list);

      const result = await service.findMe(receiverId);

      expect(notificationModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { receiverId },
          order: [['createdAt', 'DESC']],
        }),
      );
      expect(result).toEqual({ data: list, message: null });
    });
  });

  // ───────────────────────── markAsRead ─────────────────────────
  describe('markAsRead', () => {
    it('should throw NotFoundException if notification not found', async () => {
      notificationModel.findOne.mockResolvedValue(null);

      await expect(service.markAsRead(receiverId, 'n1')).rejects.toThrow(
        new NotFoundException(messages.notification.notFound),
      );
      expect(notificationGateway.sendMarkAsRead).not.toHaveBeenCalled();
    });

    it('should mark an unread notification as read, save and emit', async () => {
      const notification = {
        isRead: false,
        save: vi.fn().mockResolvedValue(undefined),
      };
      notificationModel.findOne.mockResolvedValue(notification);

      const result = await service.markAsRead(receiverId, 'n1');

      expect(notificationModel.findOne).toHaveBeenCalledWith({
        where: { id: 'n1', receiverId },
      });
      expect(notification.isRead).toBe(true);
      expect(notification.save).toHaveBeenCalled();
      expect(notificationGateway.sendMarkAsRead).toHaveBeenCalledWith(
        receiverId,
        'n1',
      );
      expect(result).toEqual({
        data: notification,
        message: messages.notification.markAsRead.success,
      });
    });

    it('should not save again if already read, but still emit the event', async () => {
      const notification = { isRead: true, save: vi.fn() };
      notificationModel.findOne.mockResolvedValue(notification);

      await service.markAsRead(receiverId, 'n1');

      expect(notification.save).not.toHaveBeenCalled();
      expect(notificationGateway.sendMarkAsRead).toHaveBeenCalledWith(
        receiverId,
        'n1',
      );
    });
  });

  // ───────────────────────── markAllAsRead ─────────────────────────
  describe('markAllAsRead', () => {
    it('should update all unread notifications and emit the event', async () => {
      notificationModel.update.mockResolvedValue([3]);

      const result = await service.markAllAsRead(receiverId);

      expect(notificationModel.update).toHaveBeenCalledWith(
        { isRead: true },
        { where: { receiverId, isRead: false } },
      );
      expect(notificationGateway.sendMarkAllAsRead).toHaveBeenCalledWith(
        receiverId,
      );
      expect(result).toEqual({
        data: null,
        message: messages.notification.markAllAsRead.success,
      });
    });
  });

  // ───────────────────────── destroy ─────────────────────────
  describe('destroy', () => {
    it('should throw NotFoundException if notification not found', async () => {
      notificationModel.findOne.mockResolvedValue(null);

      await expect(service.destroy(receiverId, 'n1')).rejects.toThrow(
        new NotFoundException(messages.notification.notFound),
      );
    });

    it('should destroy the notification and return success', async () => {
      const notification = { destroy: vi.fn().mockResolvedValue(undefined) };
      notificationModel.findOne.mockResolvedValue(notification);

      const result = await service.destroy(receiverId, 'n1');

      expect(notificationModel.findOne).toHaveBeenCalledWith({
        where: { id: 'n1', receiverId },
      });
      expect(notification.destroy).toHaveBeenCalled();
      expect(result).toEqual({
        data: null,
        message: messages.notification.destroy.success,
      });
    });
  });
});

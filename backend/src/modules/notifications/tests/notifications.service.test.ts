import { beforeEach, describe, expect, it, mock, type Mock } from 'bun:test';
import type { NotificationGateway } from '../../../config/gateways/notification.gateway';
import type { AuthenticationUser } from '../../users/schemas/user.schema';
import { NotificationsService } from '../notifications.service';
import { NotificationType } from '../schemas/enums/notification.enum';
import type { NotificationSchema } from '../schemas/notification.schema';

// ───────────────────────── types ─────────────────────────

interface FakeNotification {
  id: string;
  isRead: boolean;
  save: Mock<() => Promise<void>>;
  destroy: Mock<() => Promise<void>>;
  toJSON: Mock<() => Record<string, unknown>>;
}

interface FakeNotificationSchema {
  create: Mock<(data: unknown) => Promise<{ id: string }>>;
  findByPk: Mock<
    (id: string, options?: unknown) => Promise<FakeNotification | null>
  >;
  findAll: Mock<(options: unknown) => Promise<unknown[]>>;
  findOne: Mock<(options: unknown) => Promise<FakeNotification | null>>;
  update: Mock<(values: unknown, options: unknown) => Promise<[number]>>;
}

interface FakeGateway {
  sendNotification: Mock<(payload: unknown) => void>;
}

// ───────────────────────── helpers ─────────────────────────

const senderId = 'sender-1';
const receiverId = 'receiver-1';
const notificationId = 'notification-1';

const makeUser = (id: string): AuthenticationUser =>
  ({ id }) as unknown as AuthenticationUser;

const makeNotification = (
  overrides: Partial<FakeNotification> = {},
): FakeNotification => ({
  id: notificationId,
  isRead: false,
  save: mock(async (): Promise<void> => {}),
  destroy: mock(async (): Promise<void> => {}),
  toJSON: mock(
    (): Record<string, unknown> => ({
      id: notificationId,
      message: 'Hello',
    }),
  ),
  ...overrides,
});

// Compare results without fighting the service's narrow `as const` return types.
const plain = (value: unknown): unknown => value;

// ───────────────────────── tests ─────────────────────────

describe('NotificationsService', () => {
  let notificationSchema: FakeNotificationSchema;
  let notificationGateway: FakeGateway;
  let service: NotificationsService;

  beforeEach(() => {
    notificationSchema = {
      create: mock(
        async (_data: unknown): Promise<{ id: string }> => ({
          id: notificationId,
        }),
      ),
      findByPk: mock(
        async (
          _id: string,
          _options?: unknown,
        ): Promise<FakeNotification | null> => makeNotification(),
      ),
      findAll: mock(async (_options: unknown): Promise<unknown[]> => []),
      findOne: mock(
        async (_options: unknown): Promise<FakeNotification | null> => null,
      ),
      update: mock(
        async (_values: unknown, _options: unknown): Promise<[number]> => [0],
      ),
    };
    notificationGateway = {
      sendNotification: mock((_payload: unknown): void => {}),
    };

    service = new NotificationsService(
      notificationSchema as unknown as typeof NotificationSchema,
      notificationGateway as unknown as NotificationGateway,
    );
  });

  // ───────────────────────── create ─────────────────────────
  describe('create', () => {
    const data = {
      senderId,
      receiverId,
      targetId: 'target-1',
      type: NotificationType.CONTRACT_MESSAGE,
      message: 'You have a new message.',
      link: '/contract/contract-1',
    };

    it('does nothing when the sender is also the receiver', async () => {
      const result = await service.create({ ...data, receiverId: senderId });

      expect(result).toBeUndefined();
      expect(notificationSchema.create).not.toHaveBeenCalled();
      expect(notificationGateway.sendNotification).not.toHaveBeenCalled();
    });

    it('stores an unread notification with the given fields', async () => {
      await service.create(data);

      expect(notificationSchema.create).toHaveBeenCalledWith({
        senderId,
        receiverId,
        targetId: 'target-1',
        type: NotificationType.CONTRACT_MESSAGE,
        message: 'You have a new message.',
        isRead: false,
        link: '/contract/contract-1',
      });
    });

    it('defaults targetId and link to null', async () => {
      await service.create({
        senderId,
        receiverId,
        type: NotificationType.CONTRACT_MESSAGE,
        message: 'Hi',
      });

      expect(notificationSchema.create).toHaveBeenCalledWith(
        expect.objectContaining({ targetId: null, link: null, isRead: false }),
      );
    });

    it('re-fetches the notification with its sender and pushes it through the gateway', async () => {
      const notification = makeNotification();
      notificationSchema.create.mockResolvedValue({ id: 'created-1' });
      notificationSchema.findByPk.mockResolvedValue(notification);

      const result = await service.create(data);

      expect(notificationSchema.findByPk).toHaveBeenCalledWith(
        'created-1',
        expect.objectContaining({ include: expect.any(Array) }),
      );
      expect(notificationGateway.sendNotification).toHaveBeenCalledWith(
        notification.toJSON(),
      );
      expect(plain(result)).toEqual({
        success: true,
        message: 'Notification created successfully',
        data: notification,
      });
    });
  });

  // ───────────────────────── findMe ─────────────────────────
  describe('findMe', () => {
    it("returns the user's notifications, newest first", async () => {
      const notifications = [{ id: 'n1' }, { id: 'n2' }];
      notificationSchema.findAll.mockResolvedValue(notifications);

      const result = await service.findMe(makeUser(receiverId));

      expect(notificationSchema.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { receiverId },
          order: [['createdAt', 'DESC']],
        }),
      );
      expect(plain(result)).toEqual({ success: true, data: notifications });
    });
  });

  // ───────────────────────── markAsRead ─────────────────────────
  describe('markAsRead', () => {
    it("returns an error when the notification isn't the user's", async () => {
      notificationSchema.findOne.mockResolvedValue(null);

      const result = await service.markAsRead(
        makeUser(receiverId),
        notificationId,
      );

      expect(notificationSchema.findOne).toHaveBeenCalledWith({
        where: { id: notificationId, receiverId },
      });
      expect(plain(result)).toEqual({
        error: true,
        message: 'Notification not found',
      });
    });

    it('marks an unread notification as read and saves it', async () => {
      const notification = makeNotification({ isRead: false });
      notificationSchema.findOne.mockResolvedValue(notification);

      const result = await service.markAsRead(
        makeUser(receiverId),
        notificationId,
      );

      expect(notification.isRead).toBe(true);
      expect(notification.save).toHaveBeenCalledTimes(1);
      expect(plain(result)).toEqual({
        success: true,
        message: 'Notification marked as read successfully',
        data: notification,
      });
    });

    it("doesn't save again when it is already read", async () => {
      const notification = makeNotification({ isRead: true });
      notificationSchema.findOne.mockResolvedValue(notification);

      const result = await service.markAsRead(
        makeUser(receiverId),
        notificationId,
      );

      expect(notification.save).not.toHaveBeenCalled();
      expect(plain(result)).toMatchObject({ success: true });
    });
  });

  // ───────────────────────── markAllAsRead ─────────────────────────
  describe('markAllAsRead', () => {
    it('marks every unread notification of the user as read', async () => {
      const result = await service.markAllAsRead(makeUser(receiverId));

      expect(notificationSchema.update).toHaveBeenCalledWith(
        { isRead: true },
        { where: { receiverId, isRead: false } },
      );
      expect(plain(result)).toEqual({
        success: true,
        message: 'All notifications marked as read successfully',
      });
    });
  });

  // ───────────────────────── delete ─────────────────────────
  describe('delete', () => {
    it("returns an error when the notification isn't the user's", async () => {
      notificationSchema.findOne.mockResolvedValue(null);

      const result = await service.delete(makeUser(receiverId), notificationId);

      expect(notificationSchema.findOne).toHaveBeenCalledWith({
        where: { id: notificationId, receiverId },
      });
      expect(plain(result)).toEqual({
        error: true,
        message: 'Notification not found',
      });
    });

    it('destroys the notification', async () => {
      const notification = makeNotification();
      notificationSchema.findOne.mockResolvedValue(notification);

      const result = await service.delete(makeUser(receiverId), notificationId);

      expect(notification.destroy).toHaveBeenCalledTimes(1);
      expect(plain(result)).toEqual({
        success: true,
        message: 'Notification deleted successfully',
      });
    });
  });
});

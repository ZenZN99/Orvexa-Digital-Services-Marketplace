import type { NotificationGateway } from '../../config/gateways/notification.gateway';
import { UserProfileSchema } from '../user-profiles/schemas/user-profile.schema';
import {
  UserSchema,
  type AuthenticationUser,
} from '../users/schemas/user.schema';
import type { NotificationType } from './schemas/enums/notification.enum';
import type { NotificationSchema } from './schemas/notification.schema';

export class NotificationsService {
  constructor(
    private readonly notificationSchema: typeof NotificationSchema,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async create(data: {
    senderId: string;
    receiverId: string;
    targetId?: string | null;
    type: NotificationType;
    message: string;
    link?: string | null;
  }) {
    if (data.receiverId === data.senderId) return;

    const created = await this.notificationSchema.create({
      senderId: data.senderId,
      receiverId: data.receiverId,
      targetId: data.targetId ?? null,
      type: data.type,
      message: data.message,
      isRead: false,
      link: data.link ?? null,
    });

    const notification = await this.notificationSchema.findByPk(created.id, {
      include: [
        {
          model: UserSchema,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName'],
          include: [
            {
              model: UserProfileSchema,
              as: 'profile',
              attributes: ['avatar'],
            },
          ],
        },
      ],
    });

    this.notificationGateway.sendNotification(notification!.toJSON());

    return {
      success: true,
      message: 'Notification created successfully',
      data: notification,
    } as const;
  }

  async findMe(currentUser: AuthenticationUser) {
    const notifications = await this.notificationSchema.findAll({
      where: {
        receiverId: currentUser!.id,
      },
      include: [
        {
          model: UserSchema,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName'],
          include: [
            {
              model: UserProfileSchema,
              as: 'profile',
              attributes: ['avatar'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return {
      success: true,
      data: notifications,
    } as const;
  }

  async markAsRead(currentUser: AuthenticationUser, notificationId: string) {
    const notification = await this.notificationSchema.findOne({
      where: {
        id: notificationId,
        receiverId: currentUser!.id,
      },
    });

    if (!notification) {
      return {
        error: true,
        message: 'Notification not found',
      } as const;
    }

    if (!notification.isRead) {
      notification.isRead = true;
      await notification.save();
    }

    return {
      success: true,
      message: 'Notification marked as read successfully',
      data: notification,
    } as const;
  }

  async markAllAsRead(currentUser: AuthenticationUser) {
    await this.notificationSchema.update(
      { isRead: true },
      {
        where: {
          receiverId: currentUser.id,
          isRead: false,
        },
      },
    );

    return {
      success: true,
      message: 'All notifications marked as read successfully',
    } as const;
  }

  async delete(currentUser: AuthenticationUser, notificationId: string) {
    const notification = await this.notificationSchema.findOne({
      where: {
        id: notificationId,
        receiverId: currentUser.id,
      },
    });

    if (!notification) {
      return {
        error: true,
        message: 'Notification not found',
      } as const;
    }

    await notification.destroy();

    return {
      success: true,
      message: 'Notification deleted successfully',
    } as const;
  }
}

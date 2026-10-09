import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Notification } from './schema/notification.schema.js';
import { User } from '../users/schema/user.schema.js';
import { messages } from '../../common/libs/messages.js';
import { response } from '../../common/libs/response.js';
import { NotificationGateway } from '../../infrastructure/gateways/notification.gateway.js';
import { UserProfile } from '../profiles/user-profiles/schema/user-profile.schema.js';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,

    @Inject(forwardRef(() => NotificationGateway))
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async create(data: Partial<Notification>) {
    if (data.receiverId === data.senderId) return;

    const created = await this.notificationModel.create({
      senderId: data.senderId,
      receiverId: data.receiverId,
      targetId: data.targetId,
      type: data.type,
      message: data.message,
      isRead: false,
      link: data.link,
    });

    const notification = await this.notificationModel.findByPk(created.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName'],
          include: [
            {
              model: UserProfile,
              as: 'profile',
              attributes: ['avatar'],
            },
          ],
        },
      ],
    });

    this.notificationGateway.sendNotification(notification!.toJSON());

    return response(notification, null);
  }

  async findMe(receiverId: string) {
    const notifications = await this.notificationModel.findAll({
      where: {
        receiverId,
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName'],
          include: [
            {
              model: UserProfile,
              as: 'profile',
              attributes: ['avatar'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return response(notifications, null);
  }

  async markAsRead(receiverId: string, notificationId: string) {
    const notification = await this.notificationModel.findOne({
      where: { id: notificationId, receiverId },
    });

    if (!notification)
      throw new NotFoundException(messages.notification.notFound);

    if (!notification.isRead) {
      notification.isRead = true;
      await notification.save();
    }

    this.notificationGateway.sendMarkAsRead(receiverId, notificationId);
    return response(notification, messages.notification.markAsRead.success);
  }

  async markAllAsRead(receiverId: string) {
    await this.notificationModel.update(
      { isRead: true },
      { where: { receiverId, isRead: false } },
    );

    this.notificationGateway.sendMarkAllAsRead(receiverId);
    return response(null, messages.notification.markAllAsRead.success);
  }

  async destroy(receiverId: string, notificationId: string) {
    const notification = await this.notificationModel.findOne({
      where: {
        id: notificationId,
        receiverId,
      },
    });

    if (!notification) {
      throw new NotFoundException(messages.notification.notFound);
    }

    await notification.destroy();

    return response(null, messages.notification.destroy.success);
  }
}

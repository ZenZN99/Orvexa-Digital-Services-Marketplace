import type { SpongHandler } from 'riser-bob';
import type { NotificationType } from './schemas/enums/notification.enum';
import type { NotificationsService } from './notifications.service';
import type { AuthenticationUser } from '../users/schemas/user.schema';

export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  readonly create: SpongHandler = async (spongReq, spongRes) => {
    const data = await spongReq.json<{
      senderId: string;
      receiverId: string;
      targetId?: string | null;
      type: NotificationType;
      message: string;
      link?: string | null;
    }>();

    const result = await this.notificationService.create(data);

    return spongRes.SpongCreated({
      success: result?.success,
      message: result?.message,
      data: result?.data,
    });
  };

  readonly findMe: SpongHandler = async (spongReq, spongRes) => {
    const currentUser = spongReq.user!;

    const result = await this.notificationService.findMe(
      currentUser as AuthenticationUser,
    );

    return spongRes.SpongOK({
      success: result.success,
      data: result.data,
    });
  };

  readonly markAsRead: SpongHandler = async (spongReq, spongRes) => {
    const currentUser = spongReq.user!;
    const { notificationId } = spongReq.params;

    if (!notificationId) {
      return spongRes.SpongBadRequest({
        success: false,
        message: 'Notification ID is required',
      });
    }

    const result = await this.notificationService.markAsRead(
      currentUser as AuthenticationUser,
      notificationId,
    );

    if ('error' in result) {
      return spongRes.SpongNotFound({
        success: false,
        message: result.message,
      });
    }

    return spongRes.SpongOK({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  };

  readonly markAllAsRead: SpongHandler = async (spongReq, spongRes) => {
    const currentUser = spongReq.user!;

    const result = await this.notificationService.markAllAsRead(
      currentUser as AuthenticationUser,
    );

    return spongRes.SpongOK({
      success: result.success,
      message: result.message,
    });
  };

  readonly delete: SpongHandler = async (spongReq, spongRes) => {
    const currentUser = spongReq.user!;
    const { notificationId } = spongReq.params;

    if (!notificationId) {
      return spongRes.SpongBadRequest({
        success: false,
        message: 'Notification ID is required',
      });
    }

    const result = await this.notificationService.delete(
      currentUser as AuthenticationUser,
      notificationId,
    );

    if ('error' in result) {
      return spongRes.SpongNotFound({
        success: false,
        message: result.message,
      });
    }

    return spongRes.SpongOK({
      success: result.success,
      message: result.message,
    });
  };
}

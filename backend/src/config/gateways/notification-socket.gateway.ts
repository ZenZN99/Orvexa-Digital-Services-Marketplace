import { Socket } from "socket.io";
import type { NotificationsService } from "../../modules/notifications/notifications.service";

export class NotificationSocketGateway {
  constructor(private readonly notificationsService: NotificationsService) {}

  // Mark notification as read
  async handleMarkAsRead(
    client: Socket,
    data: {
      notificationId: string;
    },
  ) {
    const user = client.data.user;

    if (!user) {
      return;
    }

    return this.notificationsService.markAsRead(user.id, data.notificationId);
  }
}

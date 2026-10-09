import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { HttpException } from '@nestjs/common';
import { Socket } from 'socket.io';
import { FRONTEND_URL } from '../../url.js';
import { NotificationService } from '../../modules/notifications/notification.service.js';

/**
 * Handles INCOMING socket events related to notifications.
 *
 * Dependency direction (one-way, no cycle):
 *   NotificationSocketGateway -> NotificationService -> NotificationGateway
 *
 * Both gateways use the same port/namespace, so they share the same
 * socket.io server and the same connected clients.
 */
@WebSocketGateway({
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
  },
})
export class NotificationSocketGateway {
  constructor(private readonly notificationService: NotificationService) {}

  // Mark notification as read
  @SubscribeMessage('mark-as-read')
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      notificationId: string;
    },
  ) {
    const user = client.data.user;

    if (!user) {
      return;
    }

    try {
      return await this.notificationService.markAsRead(
        user.id,
        data.notificationId,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw new WsException(error.message);
      }

      throw error;
    }
  }
}

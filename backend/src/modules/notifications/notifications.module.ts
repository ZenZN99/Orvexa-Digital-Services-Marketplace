import type { RiserBob } from 'riser-bob';
import { AuthMiddleware } from 'riser-bob';
import { NotificationsController } from './notifications.controller';
import { NotificationsRouter } from './notifications.route';
import { verifyUser } from '../../config/token/verify-user';
import { NotificationSchema } from './schemas/notification.schema';
import { UserActiveMiddleware } from '../../config/middlewares/user-active.middleware';
import { RolesMiddleware } from '../../config/middlewares/roles.middleware';
import { NotificationsService } from './notifications.service';
import { NotificationGateway } from '../../config/gateways/notification.gateway';
import type { Server } from 'socket.io';

export class NotificationsModule {
  register(bob: RiserBob, io: Server): void {
    const notificationGateway = new NotificationGateway(io);

    io.on('connection', (socket) => {
      notificationGateway.handleConnection(socket);

      socket.on('disconnect', () => {
        notificationGateway.handleDisconnect(socket);
      });
    });

    const service = new NotificationsService(
      NotificationSchema,
      notificationGateway,
    );
    const controller = new NotificationsController(service);

    const authMiddleware = new AuthMiddleware(verifyUser, {
      mode: 'cookie',
      cookieName: 'token',
    });

    const userActiveMiddleware = new UserActiveMiddleware();
    const rolesMiddleware = new RolesMiddleware();

    const router = new NotificationsRouter(
      bob,
      controller,
      authMiddleware,
      userActiveMiddleware,
      rolesMiddleware,
    );

    router.register();
  }
}

import type { RiserBob } from 'riser-bob';
import { AuthMiddleware } from 'riser-bob';
import { MessagesController } from './messages.controller';
import { MessagesRouter } from './messages.route';
import { MessageSchema } from './schemas/message.schema';
import { ContractSchema } from '../contracts/schemas/contract.schema';
import { CloudinaryManager } from '../../config/cloudinary/cloudinary';
import { verifyUser } from '../../config/token/verify-user';
import { UserActiveMiddleware } from '../../config/middlewares/user-active.middleware';
import { RolesMiddleware } from '../../config/middlewares/roles.middleware';
import { MessagesService } from './messages.service';
import { MessageGateway } from '../../config/gateways/message.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationSchema } from '../notifications/schemas/notification.schema';
import { NotificationGateway } from '../../config/gateways/notification.gateway';
import type { Server } from 'socket.io';

export class MessagesModule {
  register(bob: RiserBob, io: Server): void {
    const cloudinaryManager = new CloudinaryManager();

    const notificationGateway = new NotificationGateway(io);

    const notificationsService = new NotificationsService(
      NotificationSchema,
      notificationGateway,
    );

    const messageGateway = new MessageGateway(io);

    const service = new MessagesService(
      MessageSchema,
      ContractSchema,
      cloudinaryManager,
      notificationsService,
      messageGateway,
    );

    const controller = new MessagesController(service);

    const authMiddleware = new AuthMiddleware(verifyUser, {
      mode: 'cookie',
      cookieName: 'token',
    });

    const userActiveMiddleware = new UserActiveMiddleware();
    const rolesMiddleware = new RolesMiddleware();
    const router = new MessagesRouter(
      bob,
      controller,
      authMiddleware,
      userActiveMiddleware,
      rolesMiddleware,
    );

    router.register();
  }
}

import type { RiserBob } from 'riser-bob';
import { AuthMiddleware } from 'riser-bob';
import { UserVerificationsController } from './user-verifications.controller';
import { UserVerificationsRouter } from './user-verifications.route';
import { UserActiveMiddleware } from '../../config/middlewares/user-active.middleware';
import { RolesMiddleware } from '../../config/middlewares/roles.middleware';
import { verifyUser } from '../../config/token/verify-user';
import { UserVerificationSchema } from './schemas/user-verification.schema';
import { UserVerificationsService } from './user-verifications.service';
import { CloudinaryManager } from '../../config/cloudinary/cloudinary';
import { NotificationGateway } from '../../config/gateways/notification.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationSchema } from '../notifications/schemas/notification.schema';
import { UserSchema } from '../users/schemas/user.schema';
import type { Server } from 'socket.io';

export class UserVerificationsModule {
  register(bob: RiserBob, io: Server): void {
    const cloudinaryManager = new CloudinaryManager();

    const notificationGateway = new NotificationGateway(io);

    const notificationsService = new NotificationsService(
      NotificationSchema,
      notificationGateway,
    );

    const service = new UserVerificationsService(
      UserVerificationSchema,
      UserSchema,
      notificationsService,
      cloudinaryManager,
    );
    const controller = new UserVerificationsController(service);

    const authMiddleware = new AuthMiddleware(verifyUser, {
      mode: 'cookie',
      cookieName: 'token',
    });

    const userActiveMiddleware = new UserActiveMiddleware();
    const rolesMiddleware = new RolesMiddleware();

    const router = new UserVerificationsRouter(
      bob,
      controller,
      authMiddleware,
      userActiveMiddleware,
      rolesMiddleware,
    );

    router.register();
  }
}

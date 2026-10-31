import type { RiserBob } from 'riser-bob';
import { AuthMiddleware } from 'riser-bob';
import { UsersController } from './users.controller';
import { UsersRouter } from './users.route';
import { UserSchema } from './schemas/user.schema';
import { UserActiveMiddleware } from '../../config/middlewares/user-active.middleware';
import { RolesMiddleware } from '../../config/middlewares/roles.middleware';
import { UserProfileSchema } from '../user-profiles/schemas/user-profile.schema';
import { UserVerificationSchema } from '../user-verifications/schemas/user-verification.schema';
import { verifyUser } from '../../config/token/verify-user';
import { UsersService } from './users.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationSchema } from '../notifications/schemas/notification.schema';
import { NotificationGateway } from '../../config/gateways/notification.gateway';
import type { Server } from 'socket.io';

export class UsersModule {
  register(bob: RiserBob, io: Server): void {
    const notificationGateway = new NotificationGateway(io);

    const notificationsService = new NotificationsService(
      NotificationSchema,
      notificationGateway,
    );

    const service = new UsersService(
      UserSchema,
      UserProfileSchema,
      UserVerificationSchema,
      notificationsService,
    );
    const controller = new UsersController(service);

    const authMiddleware = new AuthMiddleware(verifyUser, {
      mode: 'cookie',
      cookieName: 'token',
    });

    const userActiveMiddleware = new UserActiveMiddleware();
    const rolesMiddleware = new RolesMiddleware();

    const router = new UsersRouter(
      bob,
      controller,
      authMiddleware,
      userActiveMiddleware,
      rolesMiddleware,
    );

    router.register();
  }
}

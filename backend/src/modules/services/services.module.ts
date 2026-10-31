import type { RiserBob } from 'riser-bob';
import { AuthMiddleware } from 'riser-bob';
import { ServicesController } from './services.controller';
import { ServicesRouter } from './services.route';
import { verifyUser } from '../../config/token/verify-user';
import { ServiceSchema } from './schemas/service.schema';
import { FreelancerSchema } from '../freelancers/schemas/freelancer.schema';
import { CloudinaryManager } from '../../config/cloudinary/cloudinary';
import { UserActiveMiddleware } from '../../config/middlewares/user-active.middleware';
import { RolesMiddleware } from '../../config/middlewares/roles.middleware';
import { ServicesService } from './services.service';
import { NotificationGateway } from '../../config/gateways/notification.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationSchema } from '../notifications/schemas/notification.schema';
import { UserSchema } from '../users/schemas/user.schema';
import { UserVerificationMiddleware } from '../../config/middlewares/user-verification.middleware';
import { UserVerificationSchema } from '../user-verifications/schemas/user-verification.schema';
import type { Server } from 'socket.io';

export class ServicesModule {
  register(bob: RiserBob, io: Server): void {
    const cloudinaryManager = new CloudinaryManager();

    const notificationGateway = new NotificationGateway(io);

    const notificationsService = new NotificationsService(
      NotificationSchema,
      notificationGateway,
    );

    const service = new ServicesService(
      ServiceSchema,
      FreelancerSchema,
      UserSchema,
      notificationsService,
      cloudinaryManager,
    );

    const controller = new ServicesController(service);

    const authMiddleware = new AuthMiddleware(verifyUser, {
      mode: 'cookie',
      cookieName: 'token',
    });

    const userActiveMiddleware = new UserActiveMiddleware();
    const userVerificationMiddleware = new UserVerificationMiddleware(
      UserVerificationSchema,
    );
    const rolesMiddleware = new RolesMiddleware();

    const router = new ServicesRouter(
      bob,
      controller,
      authMiddleware,
      userActiveMiddleware,
      userVerificationMiddleware,
      rolesMiddleware,
    );

    router.register();
  }
}

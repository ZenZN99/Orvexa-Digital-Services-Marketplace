import type { RiserBob } from 'riser-bob';
import { AuthMiddleware } from 'riser-bob';
import { ReviewsController } from './reviews.controller';
import { ReviewsRouter } from './reviews.route';
import { ReviewSchema } from './schemas/review.schema';
import { ContractSchema } from '../contracts/schemas/contract.schema';
import { UserSchema } from '../users/schemas/user.schema';
import { PaymentSchema } from '../payments/schemas/payment.schema';
import { ServiceSchema } from '../services/schemas/service.schema';
import { FreelancerSchema } from '../freelancers/schemas/freelancer.schema';
import { RedisManager } from '../../config/db/redis/redis';
import { sequelize } from '../../config/db/sequelize';
import { verifyUser } from '../../config/token/verify-user';
import { UserActiveMiddleware } from '../../config/middlewares/user-active.middleware';
import { RolesMiddleware } from '../../config/middlewares/roles.middleware';
import { ReviewsService } from './reviews.service';
import { NotificationGateway } from '../../config/gateways/notification.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationSchema } from '../notifications/schemas/notification.schema';
import { redisConfig } from '../../index';
import type { Server } from 'socket.io';

export class ReviewsModule {
  register(bob: RiserBob, io: Server): void {
    const redisManager = new RedisManager(redisConfig);

    const notificationGateway = new NotificationGateway(io);

    const notificationsService = new NotificationsService(
      NotificationSchema,
      notificationGateway,
    );

    const service = new ReviewsService(
      ReviewSchema,
      ContractSchema,
      UserSchema,
      PaymentSchema,
      ServiceSchema,
      FreelancerSchema,
      notificationsService,
      redisManager,
      sequelize,
    );

    const controller = new ReviewsController(service);

    const authMiddleware = new AuthMiddleware(verifyUser, {
      mode: 'cookie',
      cookieName: 'token',
    });

    const userActiveMiddleware = new UserActiveMiddleware();
    const rolesMiddleware = new RolesMiddleware();

    const router = new ReviewsRouter(
      bob,
      controller,
      authMiddleware,
      userActiveMiddleware,
      rolesMiddleware,
    );

    router.register();
  }
}

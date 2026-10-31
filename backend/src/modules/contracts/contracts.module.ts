import type { RiserBob } from 'riser-bob';
import { AuthMiddleware } from 'riser-bob';
import { ContractsController } from './contracts.controller';
import { ContractsRouter } from './contracts.route';
import { ContractSchema } from './schemas/contract.schema';
import { UserSchema } from '../users/schemas/user.schema';
import { FreelancerSchema } from '../freelancers/schemas/freelancer.schema';
import { OrderSchema } from '../orders/schemas/order.schema';
import { ServiceSchema } from '../services/schemas/service.schema';
import { PlatformWalletSchema } from '../platform-wallets/schemas/platform-wallet.schema';
import { RedisManager } from '../../config/db/redis/redis';
import { sequelize } from '../../config/db/sequelize';
import { verifyUser } from '../../config/token/verify-user';
import { UserActiveMiddleware } from '../../config/middlewares/user-active.middleware';
import { RolesMiddleware } from '../../config/middlewares/roles.middleware';
import { ContractsService } from './contracts.service';
import { PaymentSchema } from '../payments/schemas/payment.schema';
import { NotificationGateway } from '../../config/gateways/notification.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationSchema } from '../notifications/schemas/notification.schema';
import { UserVerificationMiddleware } from '../../config/middlewares/user-verification.middleware';
import { UserVerificationSchema } from '../user-verifications/schemas/user-verification.schema';
import { redisConfig } from '../../index';
import type { Server } from 'socket.io';
import { ContractQueue } from './queues/contracts.queue';

export class ContractsModule {
  register(bob: RiserBob, io: Server): void {
    const redisManager = new RedisManager(redisConfig);

    const notificationGateway = new NotificationGateway(io);

    const notificationsService = new NotificationsService(
      NotificationSchema,
      notificationGateway,
    );

    const service = new ContractsService(
      ContractSchema,
      UserSchema,
      FreelancerSchema,
      OrderSchema,
      ServiceSchema,
      PlatformWalletSchema,
      PaymentSchema,
      notificationsService,
      redisManager,
      sequelize,
    );

    const contractQueue = new ContractQueue(service, redisConfig.getClient());

    const controller = new ContractsController(service);

    const authMiddleware = new AuthMiddleware(verifyUser, {
      mode: 'cookie',
      cookieName: 'token',
    });

    const userActiveMiddleware = new UserActiveMiddleware();
    const userVerificationMiddleware = new UserVerificationMiddleware(
      UserVerificationSchema,
    );
    const rolesMiddleware = new RolesMiddleware();

    const router = new ContractsRouter(
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

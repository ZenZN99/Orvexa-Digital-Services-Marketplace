import type { RiserBob } from 'riser-bob';
import { AuthMiddleware } from 'riser-bob';
import { PaymentsController } from './payments.controller';
import { PaymentsRouter } from './payments.route';
import { verifyUser } from '../../config/token/verify-user';
import { PaymentSchema } from './schemas/payment.schema';
import { OrderSchema } from '../orders/schemas/order.schema';
import { UserSchema } from '../users/schemas/user.schema';
import { ServiceSchema } from '../services/schemas/service.schema';
import { ContractSchema } from '../contracts/schemas/contract.schema';
import { RolesMiddleware } from '../../config/middlewares/roles.middleware';
import { UserActiveMiddleware } from '../../config/middlewares/user-active.middleware';
import { ContractQueue } from '../contracts/queues/contracts.queue';
import { sequelize } from '../../config/db/sequelize';
import { FreelancerSchema } from '../freelancers/schemas/freelancer.schema';
import { PlatformWalletSchema } from '../platform-wallets/schemas/platform-wallet.schema';
import { RedisManager } from '../../config/db/redis/redis';
import { PaymentsService } from './payments.service';
import { ContractsService } from '../contracts/contracts.service';
import { NotificationGateway } from '../../config/gateways/notification.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationSchema } from '../notifications/schemas/notification.schema';
import { UserVerificationMiddleware } from '../../config/middlewares/user-verification.middleware';
import { UserVerificationSchema } from '../user-verifications/schemas/user-verification.schema';
import { redisConfig } from '../../index';
import type { Server } from 'socket.io';

export class PaymentsModule {
  register(bob: RiserBob, io: Server): void {
    const redisManager = new RedisManager(redisConfig);

    const notificationGateway = new NotificationGateway(io);

    const notificationsService = new NotificationsService(
      NotificationSchema,
      notificationGateway,
    );

    const contractsService = new ContractsService(
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

    const contractQueue = new ContractQueue(
      contractsService,
      redisConfig.getClient(),
    );

    const service = new PaymentsService(
      PaymentSchema,
      OrderSchema,
      UserSchema,
      ServiceSchema,
      ContractSchema,
      notificationsService,
      contractQueue,
      sequelize,
    );

    const controller = new PaymentsController(service);

    const authMiddleware = new AuthMiddleware(verifyUser, {
      mode: 'cookie',
      cookieName: 'token',
    });

    const userActiveMiddleware = new UserActiveMiddleware();
    const userVerificationMiddleware = new UserVerificationMiddleware(
      UserVerificationSchema,
    );
    const rolesMiddleware = new RolesMiddleware();

    const router = new PaymentsRouter(
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

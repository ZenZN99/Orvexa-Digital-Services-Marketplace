import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Contract } from './schema/contract.schema.js';
import { User } from '../users/schema/user.schema.js';
import { Freelancer } from '../profiles/freelancer/schema/freelancer.schema.js';
import { PlatformWallet } from '../platform-wallets/schema/platform-wallet.schema.js';
import { TokenModule } from '../../infrastructure/token/token.module.js';
import { ContractController } from './contract.controller.js';
import { ContractService } from './contract.service.js';
import { BullModule } from '@nestjs/bullmq';
import { ContractProcessor } from './contract.processor.js';
import { UserVerification } from '../user-verifications/schema/user-verification.schema.js';
import { NotificationModule } from '../notifications/notification.module.js';
import { RedisModule } from '../../infrastructure/database/redis/redis.module.js';
import { Order } from '../orders/schema/order.schema.js';
import { Service } from '../services/schema/service.schema.js';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Contract,
      User,
      Freelancer,
      Order,
      Service,
      PlatformWallet,
      UserVerification,
    ]),
    TokenModule,
    NotificationModule,
    RedisModule,
    BullModule.registerQueue({
      name: 'contracts',
    }),
  ],
  controllers: [ContractController],
  providers: [ContractService, ContractProcessor],
})
export class ContractModule {}

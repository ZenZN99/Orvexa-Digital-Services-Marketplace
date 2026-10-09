import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Payment } from './schema/payment.schema.js';
import { Order } from '../orders/schema/order.schema.js';
import { User } from '../users/schema/user.schema.js';
import { Contract } from '../contracts/schema/contract.schema.js';
import { PaymentController } from './payment.controller.js';
import { PaymentService } from './payment.service.js';
import { TokenModule } from '../../infrastructure/token/token.module.js';
import { UserVerification } from '../user-verifications/schema/user-verification.schema.js';
import { Service } from '../services/schema/service.schema.js';
import { BullModule } from '@nestjs/bullmq';
import { NotificationModule } from '../notifications/notification.module.js';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Payment,
      Order,
      User,
      Service,
      Contract,
      UserVerification,
    ]),
    TokenModule,
    NotificationModule,
    BullModule.registerQueue({ name: 'contracts' }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}

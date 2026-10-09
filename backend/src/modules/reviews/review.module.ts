import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Review } from './schema/review.schema.js';
import { Contract } from '../contracts/schema/contract.schema.js';
import { Payment } from '../payments/schema/payment.schema.js';
import { Service } from '../services/schema/service.schema.js';
import { Freelancer } from '../profiles/freelancer/schema/freelancer.schema.js';
import { TokenModule } from '../../infrastructure/token/token.module.js';
import { NotificationModule } from '../notifications/notification.module.js';
import { RedisModule } from '../../infrastructure/database/redis/redis.module.js';
import { ReviewController } from './review.controller.js';
import { ReviewService } from './review.service.js';
import { User } from '../users/schema/user.schema.js';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Review,
      Contract,
      Payment,
      Service,
      Freelancer,
      User,
    ]),
    TokenModule,
    NotificationModule,
    RedisModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}

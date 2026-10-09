import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Service } from './schema/service.schema.js';
import { Freelancer } from '../profiles/freelancer/schema/freelancer.schema.js';
import { CloudinaryModule } from '../../infrastructure/cloudinary/cloudinary.module.js';
import { TokenModule } from '../../infrastructure/token/token.module.js';
import { ServiceController } from './service.controller.js';
import { ServiceService } from './service.service.js';
import { UserVerification } from '../user-verifications/schema/user-verification.schema.js';
import { User } from '../users/schema/user.schema.js';
import { NotificationModule } from '../notifications/notification.module.js';
import { RedisModule } from '../../infrastructure/database/redis/redis.module.js';

@Module({
  imports: [
    SequelizeModule.forFeature([Service, Freelancer, UserVerification, User]),
    CloudinaryModule,
    TokenModule,
    NotificationModule,
    RedisModule,
  ],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}

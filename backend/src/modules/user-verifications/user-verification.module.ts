import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserVerification } from './schema/user-verification.schema.js';
import { User } from '../users/schema/user.schema.js';
import { TokenModule } from '../../infrastructure/token/token.module.js';
import { CloudinaryModule } from '../../infrastructure/cloudinary/cloudinary.module.js';
import { NotificationModule } from '../notifications/notification.module.js';
import { UserVerificationController } from './user-verification.controller.js';
import { UserVerificationService } from './user-verification.service.js';

@Module({
  imports: [
    SequelizeModule.forFeature([UserVerification, User]),
    TokenModule,
    CloudinaryModule,
    NotificationModule,
  ],
  controllers: [UserVerificationController],
  providers: [UserVerificationService],
})
export class UserVerificationModule {}

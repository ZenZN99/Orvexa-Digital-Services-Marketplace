import { Module } from '@nestjs/common';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './schema/user.schema.js';
import { TokenModule } from '../../infrastructure/token/token.module.js';
import { NotificationModule } from '../notifications/notification.module.js';
import { UserProfile } from '../profiles/user-profiles/schema/user-profile.schema.js';
import { UserVerification } from '../user-verifications/schema/user-verification.schema.js';

@Module({
  imports: [
    SequelizeModule.forFeature([User, UserProfile, UserVerification]),
    TokenModule,
    NotificationModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/schema/user.schema.js';
import { TokenModule } from '../../infrastructure/token/token.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { RedisModule } from '../../infrastructure/database/redis/redis.module.js';
import { UserProfile } from '../profiles/user-profiles/schema/user-profile.schema.js';
import { Freelancer } from '../profiles/freelancer/schema/freelancer.schema.js';
import { UserVerification } from '../user-verifications/schema/user-verification.schema.js';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      UserProfile,
      UserVerification,
      Freelancer,
    ]),
    TokenModule,
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserProfile } from './schema/user-profile.schema.js';
import { UserProfileService } from './user-profile.service.js';
import { UserProfileController } from './user-profile.controller.js';
import { TokenModule } from '../../../infrastructure/token/token.module.js';
import { CloudinaryModule } from '../../../infrastructure/cloudinary/cloudinary.module.js';
import { User } from '../../users/schema/user.schema.js';

@Module({
  imports: [
    SequelizeModule.forFeature([UserProfile, User]),
    TokenModule,
    CloudinaryModule,
  ],
  controllers: [UserProfileController],
  providers: [UserProfileService],
})
export class UserProfileModule {}

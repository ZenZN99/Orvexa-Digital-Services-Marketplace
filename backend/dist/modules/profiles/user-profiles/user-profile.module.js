var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserProfile } from './schema/user-profile.schema.js';
import { UserProfileService } from './user-profile.service.js';
import { UserProfileController } from './user-profile.controller.js';
import { TokenModule } from '../../../infrastructure/token/token.module.js';
import { CloudinaryModule } from '../../../infrastructure/cloudinary/cloudinary.module.js';
import { User } from '../../users/schema/user.schema.js';
let UserProfileModule = class UserProfileModule {
};
UserProfileModule = __decorate([
    Module({
        imports: [
            SequelizeModule.forFeature([UserProfile, User]),
            TokenModule,
            CloudinaryModule,
        ],
        controllers: [UserProfileController],
        providers: [UserProfileService],
    })
], UserProfileModule);
export { UserProfileModule };
//# sourceMappingURL=user-profile.module.js.map
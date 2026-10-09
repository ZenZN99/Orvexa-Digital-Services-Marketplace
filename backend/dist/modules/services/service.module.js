var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
let ServiceModule = class ServiceModule {
};
ServiceModule = __decorate([
    Module({
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
], ServiceModule);
export { ServiceModule };
//# sourceMappingURL=service.module.js.map
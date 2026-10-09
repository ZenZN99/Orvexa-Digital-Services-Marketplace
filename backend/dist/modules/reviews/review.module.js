var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
let ReviewModule = class ReviewModule {
};
ReviewModule = __decorate([
    Module({
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
], ReviewModule);
export { ReviewModule };
//# sourceMappingURL=review.module.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Contract } from './schema/contract.schema.js';
import { User } from '../users/schema/user.schema.js';
import { Freelancer } from '../profiles/freelancer/schema/freelancer.schema.js';
import { PlatformWallet } from '../platform-wallets/schema/platform-wallet.schema.js';
import { TokenModule } from '../../infrastructure/token/token.module.js';
import { ContractController } from './contract.controller.js';
import { ContractService } from './contract.service.js';
import { BullModule } from '@nestjs/bullmq';
import { ContractProcessor } from './contract.processor.js';
import { UserVerification } from '../user-verifications/schema/user-verification.schema.js';
import { NotificationModule } from '../notifications/notification.module.js';
import { RedisModule } from '../../infrastructure/database/redis/redis.module.js';
import { Order } from '../orders/schema/order.schema.js';
import { Service } from '../services/schema/service.schema.js';
let ContractModule = class ContractModule {
};
ContractModule = __decorate([
    Module({
        imports: [
            SequelizeModule.forFeature([
                Contract,
                User,
                Freelancer,
                Order,
                Service,
                PlatformWallet,
                UserVerification,
            ]),
            TokenModule,
            NotificationModule,
            RedisModule,
            BullModule.registerQueue({
                name: 'contracts',
            }),
        ],
        controllers: [ContractController],
        providers: [ContractService, ContractProcessor],
    })
], ContractModule);
export { ContractModule };
//# sourceMappingURL=contract.module.js.map
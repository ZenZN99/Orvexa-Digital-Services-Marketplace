var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Payment } from './schema/payment.schema.js';
import { Order } from '../orders/schema/order.schema.js';
import { User } from '../users/schema/user.schema.js';
import { Contract } from '../contracts/schema/contract.schema.js';
import { PaymentController } from './payment.controller.js';
import { PaymentService } from './payment.service.js';
import { TokenModule } from '../../infrastructure/token/token.module.js';
import { UserVerification } from '../user-verifications/schema/user-verification.schema.js';
import { Service } from '../services/schema/service.schema.js';
import { BullModule } from '@nestjs/bullmq';
import { NotificationModule } from '../notifications/notification.module.js';
let PaymentModule = class PaymentModule {
};
PaymentModule = __decorate([
    Module({
        imports: [
            SequelizeModule.forFeature([
                Payment,
                Order,
                User,
                Service,
                Contract,
                UserVerification,
            ]),
            TokenModule,
            NotificationModule,
            BullModule.registerQueue({ name: 'contracts' }),
        ],
        controllers: [PaymentController],
        providers: [PaymentService],
    })
], PaymentModule);
export { PaymentModule };
//# sourceMappingURL=payment.module.js.map
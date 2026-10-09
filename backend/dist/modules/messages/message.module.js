var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from './schema/message.schema.js';
import { Contract } from '../contracts/schema/contract.schema.js';
import { TokenModule } from '../../infrastructure/token/token.module.js';
import { CloudinaryModule } from '../../infrastructure/cloudinary/cloudinary.module.js';
import { MessageController } from './message.controller.js';
import { MessageService } from './message.service.js';
import { User } from '../users/schema/user.schema.js';
import { NotificationModule } from '../notifications/notification.module.js';
import { MessageGateway } from '../../infrastructure/gateways/message.gateway.js';
let MessageModule = class MessageModule {
};
MessageModule = __decorate([
    Module({
        imports: [
            SequelizeModule.forFeature([Message, Contract, User]),
            TokenModule,
            CloudinaryModule,
            NotificationModule,
        ],
        controllers: [MessageController],
        providers: [MessageService, MessageGateway],
    })
], MessageModule);
export { MessageModule };
//# sourceMappingURL=message.module.js.map
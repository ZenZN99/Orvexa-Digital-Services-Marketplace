var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller.js';
import { NotificationService } from './notification.service.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { Notification } from './schema/notification.schema.js';
import { TokenModule } from '../../infrastructure/token/token.module.js';
import { NotificationGateway } from '../../infrastructure/gateways/notification.gateway.js';
import { NotificationSocketGateway } from '../../infrastructure/gateways/notification-socket.gateway.js';
import { User } from '../users/schema/user.schema.js';
let NotificationModule = class NotificationModule {
};
NotificationModule = __decorate([
    Module({
        imports: [SequelizeModule.forFeature([Notification, User]), TokenModule],
        controllers: [NotificationController],
        providers: [
            NotificationService,
            NotificationGateway,
            NotificationSocketGateway,
        ],
        exports: [NotificationService, NotificationGateway],
    })
], NotificationModule);
export { NotificationModule };
//# sourceMappingURL=notification.module.js.map
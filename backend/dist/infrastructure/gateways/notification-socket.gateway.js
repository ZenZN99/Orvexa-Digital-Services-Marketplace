var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsException, } from '@nestjs/websockets';
import { HttpException } from '@nestjs/common';
import { Socket } from 'socket.io';
import { FRONTEND_URL } from '../../url.js';
import { NotificationService } from '../../modules/notifications/notification.service.js';
let NotificationSocketGateway = class NotificationSocketGateway {
    notificationService;
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async handleMarkAsRead(client, data) {
        const user = client.data.user;
        if (!user) {
            return;
        }
        try {
            return await this.notificationService.markAsRead(user.id, data.notificationId);
        }
        catch (error) {
            if (error instanceof HttpException) {
                throw new WsException(error.message);
            }
            throw error;
        }
    }
};
__decorate([
    SubscribeMessage('mark-as-read'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], NotificationSocketGateway.prototype, "handleMarkAsRead", null);
NotificationSocketGateway = __decorate([
    WebSocketGateway({
        cors: {
            origin: FRONTEND_URL,
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [NotificationService])
], NotificationSocketGateway);
export { NotificationSocketGateway };
//# sourceMappingURL=notification-socket.gateway.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { FRONTEND_URL } from '../../url.js';
let onlineUsers = [];
const addUser = (userId, socketId) => {
    const exists = onlineUsers.some((user) => user.userId === userId && user.socketId === socketId);
    if (!exists) {
        onlineUsers.push({
            userId,
            socketId,
        });
    }
};
const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};
const getUsers = (userId) => {
    return onlineUsers.filter((user) => user.userId === userId);
};
let NotificationGateway = class NotificationGateway {
    server;
    handleConnection(client) {
        const user = client.data.user;
        if (!user) {
            client.disconnect();
            return;
        }
        addUser(user.id, client.id);
        console.log('🟢 User connected:', user.id);
        console.log('📊 Online users:', onlineUsers);
    }
    handleDisconnect(client) {
        removeUser(client.id);
        console.log('🔴 Socket disconnected:', client.id);
        console.log('📊 Online users:', onlineUsers);
    }
    sendNotification(notification) {
        const receivers = getUsers(notification.receiverId);
        console.log('📤 Sending notification to:', notification.receiverId);
        console.log('📡 Active sockets:', receivers);
        if (!receivers.length) {
            console.log('⚠️ User not online');
            return;
        }
        receivers.forEach((user) => {
            this.server.to(user.socketId).emit('receive-notification', notification);
        });
    }
    sendMarkAsRead(receiverId, notificationId) {
        const receivers = getUsers(receiverId);
        receivers.forEach((user) => {
            this.server.to(user.socketId).emit('notification-read', {
                notificationId,
            });
        });
    }
    sendMarkAllAsRead(receiverId) {
        const receivers = getUsers(receiverId);
        receivers.forEach((user) => {
            this.server.to(user.socketId).emit('notifications-marked-as-read');
        });
    }
};
__decorate([
    WebSocketServer(),
    __metadata("design:type", Server)
], NotificationGateway.prototype, "server", void 0);
NotificationGateway = __decorate([
    WebSocketGateway({
        cors: {
            origin: FRONTEND_URL,
            credentials: true,
        },
    })
], NotificationGateway);
export { NotificationGateway };
//# sourceMappingURL=notification.gateway.js.map
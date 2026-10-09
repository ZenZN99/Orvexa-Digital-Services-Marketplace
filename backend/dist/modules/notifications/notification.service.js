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
import { forwardRef, Inject, Injectable, NotFoundException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Notification } from './schema/notification.schema.js';
import { User } from '../users/schema/user.schema.js';
import { messages } from '../../common/libs/messages.js';
import { response } from '../../common/libs/response.js';
import { NotificationGateway } from '../../infrastructure/gateways/notification.gateway.js';
import { UserProfile } from '../profiles/user-profiles/schema/user-profile.schema.js';
let NotificationService = class NotificationService {
    notificationModel;
    notificationGateway;
    constructor(notificationModel, notificationGateway) {
        this.notificationModel = notificationModel;
        this.notificationGateway = notificationGateway;
    }
    async create(data) {
        if (data.receiverId === data.senderId)
            return;
        const created = await this.notificationModel.create({
            senderId: data.senderId,
            receiverId: data.receiverId,
            targetId: data.targetId,
            type: data.type,
            message: data.message,
            isRead: false,
            link: data.link,
        });
        const notification = await this.notificationModel.findByPk(created.id, {
            include: [
                {
                    model: User,
                    as: 'sender',
                    attributes: ['id', 'firstName', 'lastName'],
                    include: [
                        {
                            model: UserProfile,
                            as: 'profile',
                            attributes: ['avatar'],
                        },
                    ],
                },
            ],
        });
        this.notificationGateway.sendNotification(notification.toJSON());
        return response(notification, null);
    }
    async findMe(receiverId) {
        const notifications = await this.notificationModel.findAll({
            where: {
                receiverId,
            },
            include: [
                {
                    model: User,
                    as: 'sender',
                    attributes: ['id', 'firstName', 'lastName'],
                    include: [
                        {
                            model: UserProfile,
                            as: 'profile',
                            attributes: ['avatar'],
                        },
                    ],
                },
            ],
            order: [['createdAt', 'DESC']],
        });
        return response(notifications, null);
    }
    async markAsRead(receiverId, notificationId) {
        const notification = await this.notificationModel.findOne({
            where: { id: notificationId, receiverId },
        });
        if (!notification)
            throw new NotFoundException(messages.notification.notFound);
        if (!notification.isRead) {
            notification.isRead = true;
            await notification.save();
        }
        this.notificationGateway.sendMarkAsRead(receiverId, notificationId);
        return response(notification, messages.notification.markAsRead.success);
    }
    async markAllAsRead(receiverId) {
        await this.notificationModel.update({ isRead: true }, { where: { receiverId, isRead: false } });
        this.notificationGateway.sendMarkAllAsRead(receiverId);
        return response(null, messages.notification.markAllAsRead.success);
    }
    async destroy(receiverId, notificationId) {
        const notification = await this.notificationModel.findOne({
            where: {
                id: notificationId,
                receiverId,
            },
        });
        if (!notification) {
            throw new NotFoundException(messages.notification.notFound);
        }
        await notification.destroy();
        return response(null, messages.notification.destroy.success);
    }
};
NotificationService = __decorate([
    Injectable(),
    __param(0, InjectModel(Notification)),
    __param(1, Inject(forwardRef(() => NotificationGateway))),
    __metadata("design:paramtypes", [Object, NotificationGateway])
], NotificationService);
export { NotificationService };
//# sourceMappingURL=notification.service.js.map
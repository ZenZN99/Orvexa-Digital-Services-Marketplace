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
import { BadRequestException, Injectable, NotFoundException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SupportMessage } from './schema/support-message.schema.js';
import { SupportConversation } from '../coversations/schema/support-conversation.schema.js';
import { messages } from '../../../common/libs/messages.js';
import { SupportConversationStatus } from '../../../common/enums/support-conversation.enum.js';
import { response } from '../../../common/libs/response.js';
import { User } from '../../users/schema/user.schema.js';
import { CloudinaryService } from '../../../infrastructure/cloudinary/cloudinary.service.js';
import { UserRole } from '../../../common/enums/user.enum.js';
import { UserProfile } from '../../profiles/user-profiles/schema/user-profile.schema.js';
let SupportMessageService = class SupportMessageService {
    supportMessageModel;
    supportConversationModel;
    cloudinaryService;
    constructor(supportMessageModel, supportConversationModel, cloudinaryService) {
        this.supportMessageModel = supportMessageModel;
        this.supportConversationModel = supportConversationModel;
        this.cloudinaryService = cloudinaryService;
    }
    authorizeConversation(conversation, currentUser) {
        const isStaff = currentUser.role === UserRole.ADMIN ||
            currentUser.role === UserRole.SUPPORT;
        if (!isStaff && conversation.userId !== currentUser.id) {
            throw new NotFoundException(messages.supportConversation.notFound);
        }
    }
    async create(currentUser, conversationId, message, files = []) {
        const conversation = await this.supportConversationModel.findByPk(conversationId);
        if (!conversation) {
            throw new NotFoundException(messages.supportConversation.notFound);
        }
        this.authorizeConversation(conversation, currentUser);
        if (conversation.status !== SupportConversationStatus.OPEN) {
            throw new BadRequestException(messages.supportConversation.closed);
        }
        if (files.length > 5) {
            throw new BadRequestException(messages.supportMessage.create.maxAttachments);
        }
        if (!message?.trim() && files.length === 0) {
            throw new BadRequestException(messages.supportMessage.create.empty);
        }
        const attachments = [];
        for (const file of files) {
            const uploaded = await this.cloudinaryService.upload(file, 'support-messages/attachments');
            attachments.push(uploaded.url);
        }
        const supportMessage = await this.supportMessageModel.create({
            conversationId,
            senderId: currentUser.id,
            message: message?.trim() || null,
            attachments,
        });
        conversation.lastMessage = message?.trim() || 'Attachment';
        conversation.lastMessageSenderId = currentUser.id;
        await conversation.save();
        const fullMessage = await this.supportMessageModel.findByPk(supportMessage.id, {
            include: [
                {
                    model: User,
                    as: 'sender',
                    attributes: ['id', 'firstName', 'lastName', 'role'],
                    include: [
                        { model: UserProfile, as: 'profile', attributes: ['avatar'] },
                    ],
                },
            ],
        });
        return response(fullMessage, messages.supportMessage.create.success);
    }
    async findAll(currentUser, conversationId) {
        const conversation = await this.supportConversationModel.findByPk(conversationId);
        if (!conversation) {
            throw new NotFoundException(messages.supportConversation.notFound);
        }
        this.authorizeConversation(conversation, currentUser);
        const supportMessages = await this.supportMessageModel.findAll({
            where: {
                conversationId,
            },
            include: [
                {
                    model: User,
                    as: 'sender',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
                    include: [
                        {
                            model: UserProfile,
                            as: 'profile',
                            attributes: ['avatar'],
                        },
                    ],
                },
            ],
            order: [['createdAt', 'ASC']],
        });
        return response(supportMessages, null);
    }
    async markAllAsRead(currentUser, conversationId) {
        const conversation = await this.supportConversationModel.findByPk(conversationId);
        if (!conversation) {
            throw new NotFoundException(messages.supportConversation.notFound);
        }
        this.authorizeConversation(conversation, currentUser);
        const updatedmessages = await this.supportMessageModel.update({
            isRead: true,
        }, {
            where: {
                conversationId,
                isRead: false,
            },
        });
        return response(updatedmessages, messages.supportMessage.markAsRead.success);
    }
    async destroy(conversationId, messageId) {
        const supportMessage = await this.supportMessageModel.findOne({
            where: {
                id: messageId,
                conversationId,
            },
        });
        if (!supportMessage) {
            throw new NotFoundException(messages.supportMessage.notFound);
        }
        for (const attachment of supportMessage.attachments) {
            await this.cloudinaryService.destroy(attachment);
        }
        await supportMessage.destroy();
        return response(null, messages.supportMessage.destroy.success);
    }
};
SupportMessageService = __decorate([
    Injectable(),
    __param(0, InjectModel(SupportMessage)),
    __param(1, InjectModel(SupportConversation)),
    __metadata("design:paramtypes", [Object, Object, CloudinaryService])
], SupportMessageService);
export { SupportMessageService };
//# sourceMappingURL=support-message.service.js.map
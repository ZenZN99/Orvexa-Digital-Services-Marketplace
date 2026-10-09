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
import { SupportConversation } from './schema/support-conversation.schema.js';
import { User } from '../../users/schema/user.schema.js';
import { SupportConversationStatus } from '../../../common/enums/support-conversation.enum.js';
import { messages } from '../../../common/libs/messages.js';
import { response } from '../../../common/libs/response.js';
import { UserProfile } from '../../profiles/user-profiles/schema/user-profile.schema.js';
import { UserRole } from '../../../common/enums/user.enum.js';
let SupportConversationService = class SupportConversationService {
    supportConversationModel;
    userModel;
    constructor(supportConversationModel, userModel) {
        this.supportConversationModel = supportConversationModel;
        this.userModel = userModel;
    }
    async create(userId) {
        const existingConversation = await this.supportConversationModel.findOne({
            where: {
                userId,
                status: SupportConversationStatus.OPEN,
            },
        });
        if (existingConversation) {
            throw new BadRequestException(messages.supportConversation.alreadyOpen);
        }
        const user = await this.userModel.findByPk(userId);
        if (!user) {
            throw new NotFoundException(messages.user.notFound);
        }
        const conversation = await this.supportConversationModel.create({
            userId,
            status: SupportConversationStatus.OPEN,
        });
        return response(conversation, messages.supportConversation.create.success);
    }
    async findMe(userId) {
        const conversations = await this.supportConversationModel.findAll({
            where: {
                userId,
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'email'],
                    include: [
                        {
                            model: UserProfile,
                            as: 'profile',
                            attributes: ['avatar'],
                        },
                    ],
                },
                {
                    model: User,
                    as: 'lastMessageSender',
                    attributes: ['id', 'firstName', 'lastName'],
                },
            ],
            order: [['updatedAt', 'DESC']],
        });
        return response(conversations, null);
    }
    async findOne(userId, conversationId) {
        const currentUser = await this.userModel.findByPk(userId);
        if (!currentUser) {
            throw new NotFoundException(messages.user.notFound);
        }
        const isStaff = currentUser.role === UserRole.ADMIN ||
            currentUser.role === UserRole.SUPPORT;
        const conversation = await this.supportConversationModel.findOne({
            where: isStaff
                ? {
                    id: conversationId,
                }
                : {
                    id: conversationId,
                    userId,
                },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'email'],
                    include: [
                        {
                            model: UserProfile,
                            as: 'profile',
                            attributes: ['avatar'],
                        },
                    ],
                },
                {
                    model: User,
                    as: 'lastMessageSender',
                    attributes: ['id', 'firstName', 'lastName'],
                },
                {
                    model: User,
                    as: 'closedByUser',
                    attributes: ['id', 'firstName', 'lastName'],
                },
            ],
        });
        if (!conversation) {
            throw new NotFoundException(messages.supportConversation.notFound);
        }
        return response(conversation, null);
    }
    async findAll(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const { rows: conversations, count: total } = await this.supportConversationModel.findAndCountAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'email'],
                    include: [
                        {
                            model: UserProfile,
                            as: 'profile',
                            attributes: ['avatar'],
                        },
                    ],
                },
                {
                    model: User,
                    as: 'lastMessageSender',
                    attributes: ['id', 'firstName', 'lastName'],
                },
                {
                    model: User,
                    as: 'closedByUser',
                    attributes: ['id', 'firstName', 'lastName'],
                },
            ],
            order: [['updatedAt', 'DESC']],
            limit,
            offset,
        });
        const totalPages = Math.ceil(total / limit);
        return response({
            conversations,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        }, null);
    }
    async toggle(adminId, conversationId) {
        const conversation = await this.supportConversationModel.findByPk(conversationId);
        if (!conversation) {
            throw new NotFoundException(messages.supportConversation.notFound);
        }
        if (conversation.status === SupportConversationStatus.OPEN) {
            conversation.status = SupportConversationStatus.CLOSED;
            conversation.closedAt = new Date();
            conversation.closedBy = adminId;
            await conversation.save();
            return response(conversation, messages.supportConversation.close.success);
        }
        conversation.status = SupportConversationStatus.OPEN;
        conversation.closedAt = null;
        conversation.closedBy = null;
        await conversation.save();
        return response(conversation, messages.supportConversation.open.success);
    }
};
SupportConversationService = __decorate([
    Injectable(),
    __param(0, InjectModel(SupportConversation)),
    __param(1, InjectModel(User)),
    __metadata("design:paramtypes", [Object, Object])
], SupportConversationService);
export { SupportConversationService };
//# sourceMappingURL=support-conversation.service.js.map
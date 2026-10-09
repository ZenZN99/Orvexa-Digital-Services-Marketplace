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
import { User } from './schema/user.schema.js';
import { response } from '../../common/libs/response.js';
import { messages } from '../../common/libs/messages.js';
import { UserRole } from '../../common/enums/user.enum.js';
import { NotificationService } from '../notifications/notification.service.js';
import { NotificationType } from '../../common/enums/notification.enum.js';
import { sanitizeUser } from '../../common/libs/sanitize-user.js';
import { UserProfile } from '../profiles/user-profiles/schema/user-profile.schema.js';
import { UserVerification } from '../user-verifications/schema/user-verification.schema.js';
let UserService = class UserService {
    userModel;
    userProfileModel;
    userVerificationModel;
    notificationService;
    constructor(userModel, userProfileModel, userVerificationModel, notificationService) {
        this.userModel = userModel;
        this.userProfileModel = userProfileModel;
        this.userVerificationModel = userVerificationModel;
        this.notificationService = notificationService;
    }
    async findAll(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const { rows: users, count: total } = await this.userModel.findAndCountAll({
            offset,
            limit,
            order: [['createdAt', 'DESC']],
        });
        const userIds = users.map((user) => user.id);
        const [profiles, verifications] = await Promise.all([
            this.userProfileModel.findAll({
                where: {
                    userId: userIds,
                },
                attributes: ['id', 'userId', 'avatar', 'cover', 'bio'],
            }),
            this.userVerificationModel.findAll({
                where: {
                    userId: userIds,
                },
                attributes: [
                    'id',
                    'userId',
                    'profileImage',
                    'identityDocument',
                    'status',
                    'rejectionReason',
                    'submittedAt',
                    'reviewedAt',
                ],
            }),
        ]);
        const profileMap = new Map(profiles.map((profile) => [profile.userId, profile.get({ plain: true })]));
        const verificationMap = new Map(verifications.map((verification) => [
            verification.userId,
            verification.get({ plain: true }),
        ]));
        const safeUsers = users.map((user) => ({
            ...sanitizeUser(user),
            profile: profileMap.get(user.id) ?? null,
            verification: verificationMap.get(user.id) ?? null,
        }));
        const totalPages = Math.ceil(total / limit);
        return response({
            users: safeUsers,
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
    async findOne(userId) {
        const user = await this.userModel.findOne({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new NotFoundException(messages.user.notFound);
        }
        const [profile, verification] = await Promise.all([
            this.userProfileModel.findOne({
                where: {
                    userId: user.id,
                },
                attributes: ['id', 'avatar', 'cover', 'bio'],
            }),
            this.userVerificationModel.findOne({
                where: {
                    userId: user.id,
                },
                attributes: ['status'],
            }),
        ]);
        const safeUser = sanitizeUser(user);
        return response({
            ...safeUser,
            profile: profile?.get({ plain: true }) ?? null,
            verification: verification?.get({ plain: true }) ?? null,
        }, null);
    }
    async udpateRole(userId, role) {
        const allowedRoles = [
            UserRole.CLIENT,
            UserRole.FREELANCER,
            UserRole.SUPPORT,
        ];
        if (!allowedRoles.includes(role)) {
            throw new BadRequestException(messages.user.updateRole.invalidRole);
        }
        const user = await this.userModel.findByPk(userId);
        if (!user) {
            throw new NotFoundException(messages.user.notFound);
        }
        user.role = role;
        await user.save();
        return response(user, messages.user.updateRole.success);
    }
    async block(adminId, userId) {
        const user = await this.userModel.findByPk(userId);
        if (!user) {
            throw new NotFoundException(messages.user.notFound);
        }
        user.isActive = false;
        await user.save();
        await this.notificationService.create({
            senderId: adminId,
            receiverId: userId,
            targetId: userId,
            type: NotificationType.BLOCK_USER,
            message: 'Your account has been blocked.',
            link: null,
        });
        return response(user, messages.user.block.success);
    }
};
UserService = __decorate([
    Injectable(),
    __param(0, InjectModel(User)),
    __param(1, InjectModel(UserProfile)),
    __param(2, InjectModel(UserVerification)),
    __metadata("design:paramtypes", [Object, Object, Object, NotificationService])
], UserService);
export { UserService };
//# sourceMappingURL=user.service.js.map
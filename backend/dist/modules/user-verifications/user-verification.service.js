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
import { UserVerification } from './schema/user-verification.schema.js';
import { CloudinaryService } from '../../infrastructure/cloudinary/cloudinary.service.js';
import { User } from '../users/schema/user.schema.js';
import { messages } from '../../common/libs/messages.js';
import { UserVerificationStatus } from '../../common/enums/user-verification.enum.js';
import { response } from '../../common/libs/response.js';
import { NotificationService } from '../notifications/notification.service.js';
import { UserRole } from '../../common/enums/user.enum.js';
import { NotificationType } from '../../common/enums/notification.enum.js';
import { UserProfile } from '../profiles/user-profiles/schema/user-profile.schema.js';
let UserVerificationService = class UserVerificationService {
    userVerificationModel;
    userModel;
    cloudinaryService;
    notificationService;
    constructor(userVerificationModel, userModel, cloudinaryService, notificationService) {
        this.userVerificationModel = userVerificationModel;
        this.userModel = userModel;
        this.cloudinaryService = cloudinaryService;
        this.notificationService = notificationService;
    }
    async create(userId, profileImage, identityDocument) {
        const user = await this.userModel.findByPk(userId);
        if (!user) {
            throw new NotFoundException(messages.user.notFound);
        }
        const existingVerification = await this.userVerificationModel.findOne({
            where: {
                userId,
            },
        });
        if (existingVerification) {
            if (existingVerification.status === UserVerificationStatus.PENDING) {
                throw new BadRequestException(messages.userVerification.alreadyPending);
            }
            if (existingVerification.status === UserVerificationStatus.APPROVED) {
                throw new BadRequestException(messages.userVerification.alreadyVerified);
            }
            await this.deleteImages(existingVerification);
        }
        const uploadedProfileImage = await this.cloudinaryService.upload(profileImage, 'verifications/profile');
        const uploadedIdentityDocument = await this.cloudinaryService.upload(identityDocument, 'verifications/identity');
        if (existingVerification) {
            existingVerification.profileImage = {
                url: uploadedProfileImage.url,
                publicId: uploadedProfileImage.publicId,
            };
            existingVerification.identityDocument = {
                url: uploadedIdentityDocument.url,
                publicId: uploadedIdentityDocument.publicId,
            };
            existingVerification.status = UserVerificationStatus.PENDING;
            existingVerification.rejectionReason = null;
            existingVerification.reviewedBy = null;
            existingVerification.reviewedAt = null;
            existingVerification.submittedAt = new Date();
            await existingVerification.save();
            const admins = await this.userModel.findAll({
                where: {
                    role: UserRole.ADMIN,
                },
            });
            for (const admin of admins) {
                await this.notificationService.create({
                    senderId: userId,
                    receiverId: admin.id,
                    targetId: existingVerification.id,
                    type: NotificationType.USER_VERIFICATION,
                    message: 'A user has resubmitted an identity verification request.',
                    link: '/admin',
                });
            }
            return response(existingVerification, messages.userVerification.resubmit.success);
        }
        const verification = await this.userVerificationModel.create({
            userId,
            profileImage: {
                url: uploadedProfileImage.url,
                publicId: uploadedProfileImage.publicId,
            },
            identityDocument: {
                url: uploadedIdentityDocument.url,
                publicId: uploadedIdentityDocument.publicId,
            },
            status: UserVerificationStatus.PENDING,
            submittedAt: new Date(),
        });
        const admins = await this.userModel.findAll({
            where: {
                role: UserRole.ADMIN,
            },
        });
        for (const admin of admins) {
            await this.notificationService.create({
                senderId: userId,
                receiverId: admin.id,
                targetId: verification.id,
                type: NotificationType.USER_VERIFICATION,
                message: 'A new identity verification request has been submitted.',
                link: '/admin',
            });
        }
        return response(verification, messages.userVerification.create.success);
    }
    async findPending(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const { rows: verifications, count: total } = await this.userVerificationModel.findAndCountAll({
            where: {
                status: UserVerificationStatus.PENDING,
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'isActive'],
                    include: [
                        {
                            model: UserProfile,
                            as: 'profile',
                            attributes: ['id', 'avatar', 'cover', 'bio'],
                        },
                    ],
                },
            ],
            order: [['submittedAt', 'ASC']],
            offset,
            limit,
        });
        const totalPages = Math.ceil(total / limit);
        return response({
            verifications,
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
    async tryAgain(userId) {
        const verification = await this.userVerificationModel.findOne({
            where: {
                userId,
            },
        });
        if (!verification) {
            throw new NotFoundException(messages.userVerification.notFound);
        }
        if (verification.status === UserVerificationStatus.PENDING) {
            throw new BadRequestException(messages.userVerification.alreadyPending);
        }
        if (verification.status === UserVerificationStatus.APPROVED) {
            throw new BadRequestException(messages.userVerification.alreadyVerified);
        }
        await this.deleteImages(verification);
        verification.profileImage = null;
        verification.identityDocument = null;
        verification.status = null;
        verification.rejectionReason = null;
        verification.reviewedBy = null;
        verification.reviewedAt = null;
        verification.submittedAt = null;
        await verification.save();
        return response(verification, null);
    }
    async updateStatus(adminId, verificationId, data) {
        const verification = await this.userVerificationModel.findByPk(verificationId);
        if (!verification) {
            throw new NotFoundException(messages.userVerification.notFound);
        }
        if (verification.status !== UserVerificationStatus.PENDING) {
            throw new BadRequestException(messages.userVerification.alreadyReviewed);
        }
        if (data.status === UserVerificationStatus.REJECTED &&
            !data.rejectionReason?.trim()) {
            throw new BadRequestException(messages.userVerification.rejectionReasonRequired);
        }
        if (data.status === UserVerificationStatus.APPROVED) {
            verification.rejectionReason =
                'Congratulations! Your identity has been verified successfully.';
        }
        if (data.status === UserVerificationStatus.REJECTED) {
            verification.rejectionReason = data.rejectionReason.trim();
        }
        verification.status = data.status;
        verification.reviewedBy = adminId;
        verification.reviewedAt = new Date();
        await verification.save();
        await this.notificationService.create({
            senderId: adminId,
            receiverId: verification.userId,
            targetId: verification.id,
            type: data.status === UserVerificationStatus.APPROVED
                ? NotificationType.USER_VERIFICATION_APPROVED
                : NotificationType.USER_VERIFICATION_REJECTED,
            message: data.status === UserVerificationStatus.APPROVED
                ? 'Your identity verification has been approved.'
                : 'Your identity verification has been rejected.',
            link: '/identity-verification',
        });
        return response(verification, messages.userVerification.updateStatus.success);
    }
    async deleteImages(verification) {
        if (verification.profileImage?.publicId) {
            await this.cloudinaryService.destroy(verification.profileImage.publicId);
        }
        if (verification.identityDocument?.publicId) {
            await this.cloudinaryService.destroy(verification.identityDocument.publicId);
        }
    }
};
UserVerificationService = __decorate([
    Injectable(),
    __param(0, InjectModel(UserVerification)),
    __param(1, InjectModel(User)),
    __metadata("design:paramtypes", [Object, Object, CloudinaryService,
        NotificationService])
], UserVerificationService);
export { UserVerificationService };
//# sourceMappingURL=user-verification.service.js.map
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
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserProfile } from './schema/user-profile.schema.js';
import { CloudinaryService } from '../../../infrastructure/cloudinary/cloudinary.service.js';
import { messages } from '../../../common/libs/messages.js';
import { response } from '../../../common/libs/response.js';
let UserProfileService = class UserProfileService {
    userProfileModel;
    cloudinaryService;
    constructor(userProfileModel, cloudinaryService) {
        this.userProfileModel = userProfileModel;
        this.cloudinaryService = cloudinaryService;
    }
    async update(userId, data, avatar, cover) {
        const profile = await this.userProfileModel.findOne({
            where: {
                userId,
            },
        });
        if (!profile) {
            throw new NotFoundException(messages.userProfile.notFound);
        }
        if (avatar) {
            const result = await this.cloudinaryService.upload(avatar, 'user-profiles/avatars');
            if (profile.avatar?.publicId) {
                await this.cloudinaryService.destroy(profile.avatar.publicId);
            }
            profile.avatar = result;
        }
        if (cover) {
            const result = await this.cloudinaryService.upload(cover, 'user-profiles/covers');
            if (profile.cover?.publicId) {
                await this.cloudinaryService.destroy(profile.cover.publicId);
            }
            profile.cover = result;
        }
        if (data.bio !== undefined) {
            profile.bio = data.bio;
        }
        await profile.save();
        return response(profile, messages.userProfile.update.success);
    }
};
UserProfileService = __decorate([
    Injectable(),
    __param(0, InjectModel(UserProfile)),
    __metadata("design:paramtypes", [Object, CloudinaryService])
], UserProfileService);
export { UserProfileService };
//# sourceMappingURL=user-profile.service.js.map
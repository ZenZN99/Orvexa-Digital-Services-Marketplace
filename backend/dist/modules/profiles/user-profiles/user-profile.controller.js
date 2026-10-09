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
import { Body, Controller, Put, Req, UploadedFiles, UseGuards, UseInterceptors, } from '@nestjs/common';
import { UserProfileService } from './user-profile.service.js';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UpdateUserProfileDTO } from './dto/update.js';
import { ResponseInterceptor } from '../../../common/interceptors/response.interceptor.js';
import { UserActiveGuard } from '../../../common/guards/user-active.guard.js';
import { AuthGuard } from '../../../common/guards/auth.guard.js';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags, } from '@nestjs/swagger';
let UserProfileController = class UserProfileController {
    userProfileService;
    constructor(userProfileService) {
        this.userProfileService = userProfileService;
    }
    update(req, data, files) {
        return this.userProfileService.update(req.user.id, data, files.avatar?.[0], files.cover?.[0]);
    }
};
__decorate([
    ApiOperation({
        summary: 'Update the current user profile',
        description: 'Updates the authenticated user profile and optionally uploads a new avatar or cover image.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
        description: 'User profile data and optional profile images.',
        schema: {
            type: 'object',
            properties: {
                bio: {
                    type: 'string',
                    example: 'Software Engineer and Full-Stack Engineer.',
                },
                avatar: {
                    type: 'string',
                    format: 'binary',
                },
                cover: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    ApiResponse({
        status: 200,
        description: 'User profile updated successfully.',
    }),
    ApiResponse({
        status: 400,
        description: 'Invalid profile data or uploaded file.',
    }),
    ApiResponse({
        status: 401,
        description: 'Authentication is required.',
    }),
    ApiResponse({
        status: 403,
        description: 'The user account is not active.',
    }),
    ApiResponse({
        status: 404,
        description: 'User profile not found.',
    }),
    Put(),
    UseInterceptors(FileFieldsInterceptor([
        { name: 'avatar', maxCount: 1 },
        { name: 'cover', maxCount: 1 },
    ])),
    __param(0, Req()),
    __param(1, Body()),
    __param(2, UploadedFiles()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UpdateUserProfileDTO, Object]),
    __metadata("design:returntype", void 0)
], UserProfileController.prototype, "update", null);
UserProfileController = __decorate([
    ApiTags('User Profiles'),
    Controller('api/user-profiles'),
    UseInterceptors(ResponseInterceptor),
    UseGuards(AuthGuard, UserActiveGuard),
    __metadata("design:paramtypes", [UserProfileService])
], UserProfileController);
export { UserProfileController };
//# sourceMappingURL=user-profile.controller.js.map
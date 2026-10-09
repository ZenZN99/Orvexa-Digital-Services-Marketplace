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
import { Body, Controller, Get, Param, Patch, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors, } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UserVerificationService } from './user-verification.service.js';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { UserActiveGuard } from '../../common/guards/user-active.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/role.decorator.js';
import { UserRole } from '../../common/enums/user.enum.js';
import { UpdateUserVerificationDTO } from './dto/update.js';
let UserVerificationController = class UserVerificationController {
    userVerificationService;
    constructor(userVerificationService) {
        this.userVerificationService = userVerificationService;
    }
    create(req, files) {
        return this.userVerificationService.create(req.user.id, files[0], files[1]);
    }
    findPending(page, limit) {
        return this.userVerificationService.findPending(Number(page) || 1, Number(limit) || 10);
    }
    tryAgain(req) {
        return this.userVerificationService.tryAgain(req.user.id);
    }
    updateStatus(req, verificationId, data) {
        return this.userVerificationService.updateStatus(req.user.id, verificationId, data);
    }
};
__decorate([
    ApiOperation({
        summary: 'Submit identity verification',
        description: 'Submits an identity verification request with a profile image and an identity document.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
        schema: {
            type: 'object',
            properties: {
                images: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                    minItems: 2,
                    maxItems: 2,
                    description: 'Two images are required: profile image and identity document.',
                },
            },
            required: ['images'],
        },
    }),
    ApiResponse({
        status: 201,
        description: 'Verification request submitted successfully.',
    }),
    ApiResponse({
        status: 400,
        description: 'The user already has a pending or approved verification request.',
    }),
    ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    }),
    ApiResponse({
        status: 403,
        description: 'Forbidden. Client or freelancer access is required.',
    }),
    Post(),
    UseInterceptors(FilesInterceptor('images', 2)),
    __param(0, Req()),
    __param(1, UploadedFiles()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", void 0)
], UserVerificationController.prototype, "create", null);
__decorate([
    ApiOperation({
        summary: 'Get pending verification requests',
        description: 'Returns a paginated list of pending identity verification requests ordered by submission date.',
    }),
    ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        example: 1,
        description: 'Page number.',
    }),
    ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        example: 10,
        description: 'Number of verification requests per page.',
    }),
    ApiResponse({
        status: 200,
        description: 'Pending verification requests retrieved successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'Authentication is required.',
    }),
    ApiResponse({
        status: 403,
        description: 'Admin access is required.',
    }),
    Get('pending'),
    Roles(UserRole.ADMIN),
    __param(0, Query('page')),
    __param(1, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UserVerificationController.prototype, "findPending", null);
__decorate([
    ApiOperation({
        summary: 'Retry identity verification',
        description: 'Resets the current identity verification request and allows the user to submit a new verification request.',
    }),
    ApiResponse({
        status: 200,
        description: 'Identity verification reset successfully.',
    }),
    ApiResponse({
        status: 400,
        description: 'The user cannot retry identity verification at this time.',
    }),
    ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    }),
    ApiResponse({
        status: 404,
        description: 'User verification not found.',
    }),
    Post('try-again'),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserVerificationController.prototype, "tryAgain", null);
__decorate([
    ApiOperation({
        summary: 'Update verification status',
        description: 'Approves or rejects a pending identity verification request.',
    }),
    ApiParam({
        name: 'id',
        description: 'User verification ID.',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiBody({
        type: UpdateUserVerificationDTO,
    }),
    ApiResponse({
        status: 200,
        description: 'User verification status updated successfully.',
    }),
    ApiResponse({
        status: 400,
        description: 'The verification has already been reviewed or a rejection reason is required.',
    }),
    ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    }),
    ApiResponse({
        status: 403,
        description: 'Forbidden. Admin access is required.',
    }),
    ApiResponse({
        status: 404,
        description: 'User verification not found.',
    }),
    Patch(':id/status'),
    Roles(UserRole.ADMIN),
    __param(0, Req()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateUserVerificationDTO]),
    __metadata("design:returntype", void 0)
], UserVerificationController.prototype, "updateStatus", null);
UserVerificationController = __decorate([
    ApiTags('User Verification'),
    ApiBearerAuth(),
    Controller('api/user-verifications'),
    UseInterceptors(ResponseInterceptor),
    UseGuards(AuthGuard, UserActiveGuard, RolesGuard),
    __metadata("design:paramtypes", [UserVerificationService])
], UserVerificationController);
export { UserVerificationController };
//# sourceMappingURL=user-verification.controller.js.map
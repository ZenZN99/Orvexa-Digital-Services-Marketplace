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
import { Body, Controller, Delete, Get, Param, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors, } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, } from '@nestjs/swagger';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { UserActiveGuard } from '../../common/guards/user-active.guard.js';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MessageService } from './message.service.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/role.decorator.js';
import { UserRole } from '../../common/enums/user.enum.js';
let MessageController = class MessageController {
    messageService;
    constructor(messageService) {
        this.messageService = messageService;
    }
    create(req, contractId, content, images) {
        return this.messageService.create(req.user.id, contractId, content, images);
    }
    findAll(page, limit) {
        return this.messageService.findAll(Number(page) || 1, Number(limit) || 10);
    }
    findMe(req, contractId) {
        return this.messageService.findMe(req.user.id, contractId);
    }
    destroy(req, messageId) {
        return this.messageService.destroy(req.user, messageId);
    }
};
__decorate([
    ApiOperation({
        summary: 'Send a message',
        description: 'Sends a message to the other participant of the contract with optional images.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiParam({
        name: 'contractId',
        description: 'Contract ID.',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiBody({
        schema: {
            type: 'object',
            properties: {
                content: {
                    type: 'string',
                    example: 'Here is the updated design. Please check it.',
                    maxLength: 5000,
                },
                images: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                    maxItems: 5,
                },
            },
        },
    }),
    ApiResponse({
        status: 201,
        description: 'Message sent successfully.',
    }),
    ApiResponse({
        status: 400,
        description: 'Message must contain text or at least one image, or the contract is closed.',
    }),
    ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    }),
    ApiResponse({
        status: 404,
        description: 'Contract not found.',
    }),
    Post(':contractId'),
    UseInterceptors(FilesInterceptor('images', 5)),
    __param(0, Req()),
    __param(1, Param('contractId')),
    __param(2, Body('content')),
    __param(3, UploadedFiles()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Array]),
    __metadata("design:returntype", void 0)
], MessageController.prototype, "create", null);
__decorate([
    ApiOperation({
        summary: 'Get all messages',
        description: 'Retrieves all messages for administrative monitoring with pagination.',
    }),
    ApiQuery({
        name: 'page',
        required: false,
        example: 1,
        description: 'Page number.',
    }),
    ApiQuery({
        name: 'limit',
        required: false,
        example: 10,
        description: 'Number of messages per page.',
    }),
    ApiResponse({
        status: 200,
        description: 'Messages retrieved successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    }),
    ApiResponse({
        status: 403,
        description: 'Forbidden.',
    }),
    Get(),
    Roles(UserRole.ADMIN),
    __param(0, Query('page')),
    __param(1, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MessageController.prototype, "findAll", null);
__decorate([
    ApiOperation({
        summary: 'Get contract messages',
        description: 'Retrieves all messages for a contract between the authenticated client and freelancer.',
    }),
    ApiParam({
        name: 'contractId',
        description: 'Contract ID.',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiResponse({
        status: 200,
        description: 'Messages retrieved successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    }),
    ApiResponse({
        status: 404,
        description: 'Contract not found.',
    }),
    Get(':contractId'),
    __param(0, Req()),
    __param(1, Param('contractId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MessageController.prototype, "findMe", null);
__decorate([
    ApiOperation({
        summary: 'Delete a message',
        description: 'Deletes a message. The sender can delete their own message while the contract is in progress. Admins can delete any message regardless of the contract status.',
    }),
    ApiParam({
        name: 'id',
        description: 'Message ID.',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiResponse({
        status: 200,
        description: 'Message deleted successfully.',
    }),
    ApiResponse({
        status: 400,
        description: 'The message cannot be deleted because the contract is no longer in progress.',
    }),
    ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    }),
    ApiResponse({
        status: 403,
        description: 'You are not allowed to delete this message.',
    }),
    ApiResponse({
        status: 404,
        description: 'Message not found.',
    }),
    Delete(':id'),
    __param(0, Req()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MessageController.prototype, "destroy", null);
MessageController = __decorate([
    ApiTags('Messages'),
    Controller('api/messages'),
    UseInterceptors(ResponseInterceptor),
    UseGuards(AuthGuard, UserActiveGuard, RolesGuard),
    __metadata("design:paramtypes", [MessageService])
], MessageController);
export { MessageController };
//# sourceMappingURL=message.controller.js.map
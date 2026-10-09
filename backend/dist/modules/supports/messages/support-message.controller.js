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
import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFiles, UseGuards, UseInterceptors, } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags, } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SupportMessageService } from './support-message.service.js';
import { ResponseInterceptor } from '../../../common/interceptors/response.interceptor.js';
import { AuthGuard } from '../../../common/guards/auth.guard.js';
import { UserActiveGuard } from '../../../common/guards/user-active.guard.js';
import { RolesGuard } from '../../../common/guards/roles.guard.js';
import { Roles } from '../../../common/decorators/role.decorator.js';
import { UserRole } from '../../../common/enums/user.enum.js';
let SupportMessageController = class SupportMessageController {
    supportMessageService;
    constructor(supportMessageService) {
        this.supportMessageService = supportMessageService;
    }
    create(req, conversationId, message, files) {
        return this.supportMessageService.create(req.user, conversationId, message, files);
    }
    findAll(req, conversationId) {
        return this.supportMessageService.findAll(req.user, conversationId);
    }
    markAllAsRead(req, conversationId) {
        return this.supportMessageService.markAllAsRead(req.user, conversationId);
    }
    destroy(conversationId, messageId) {
        return this.supportMessageService.destroy(conversationId, messageId);
    }
};
__decorate([
    ApiOperation({
        summary: 'Send a support message',
        description: 'Sends a message to a support conversation. Clients and freelancers can send messages to their own conversations, while support staff and administrators can reply to any support conversation.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiParam({
        name: 'conversationId',
        description: 'Support conversation ID.',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiBody({
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    nullable: true,
                    example: 'Hello, I need help with my order.',
                    description: 'Optional message content.',
                },
                attachments: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                    maxItems: 5,
                    description: 'Optional attachments. Maximum 5 files.',
                },
            },
        },
    }),
    ApiResponse({
        status: 201,
        description: 'Support message sent successfully.',
    }),
    ApiResponse({
        status: 400,
        description: 'The support conversation is closed or the message contains neither text nor attachments.',
    }),
    ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    }),
    ApiResponse({
        status: 404,
        description: 'Support conversation not found.',
    }),
    Post(':conversationId'),
    UseInterceptors(FilesInterceptor('attachments', 5)),
    __param(0, Req()),
    __param(1, Param('conversationId')),
    __param(2, Body('message')),
    __param(3, UploadedFiles()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Array]),
    __metadata("design:returntype", void 0)
], SupportMessageController.prototype, "create", null);
__decorate([
    ApiOperation({
        summary: 'Get support messages',
        description: 'Retrieves all messages from a support conversation. Clients and freelancers can access their own conversations, while support staff and administrators can access any support conversation.',
    }),
    ApiParam({
        name: 'conversationId',
        description: 'Support conversation ID.',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiResponse({
        status: 200,
        description: 'Support messages retrieved successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    }),
    ApiResponse({
        status: 404,
        description: 'Support conversation not found.',
    }),
    Get(':conversationId'),
    __param(0, Req()),
    __param(1, Param('conversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SupportMessageController.prototype, "findAll", null);
__decorate([
    ApiOperation({
        summary: 'Mark all support messages as read',
        description: 'Marks all unread messages in a support conversation as read. Clients and freelancers can mark messages in their own conversations, while support staff and administrators can mark messages in any support conversation.',
    }),
    ApiParam({
        name: 'conversationId',
        description: 'Support conversation ID.',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiResponse({
        status: 200,
        description: 'Support messages marked as read successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    }),
    ApiResponse({
        status: 404,
        description: 'Support conversation not found.',
    }),
    Patch(':conversationId'),
    __param(0, Req()),
    __param(1, Param('conversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SupportMessageController.prototype, "markAllAsRead", null);
__decorate([
    ApiOperation({
        summary: 'Delete a support message',
        description: 'Deletes a support message and its attachments. Only administrators and support staff can delete support messages.',
    }),
    ApiParam({
        name: 'conversationId',
        description: 'Support conversation ID.',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiParam({
        name: 'messageId',
        description: 'Support message ID.',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiResponse({
        status: 200,
        description: 'Support message deleted successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    }),
    ApiResponse({
        status: 403,
        description: 'Only administrators and support staff can delete support messages.',
    }),
    ApiResponse({
        status: 404,
        description: 'Support message or support conversation not found.',
    }),
    Delete(':conversationId/:messageId'),
    Roles(UserRole.ADMIN, UserRole.SUPPORT),
    __param(0, Param('conversationId')),
    __param(1, Param('messageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SupportMessageController.prototype, "destroy", null);
SupportMessageController = __decorate([
    ApiTags('Support Messages'),
    Controller('api/support-messages'),
    UseInterceptors(ResponseInterceptor),
    UseGuards(AuthGuard, UserActiveGuard, RolesGuard),
    __metadata("design:paramtypes", [SupportMessageService])
], SupportMessageController);
export { SupportMessageController };
//# sourceMappingURL=support-message.controller.js.map
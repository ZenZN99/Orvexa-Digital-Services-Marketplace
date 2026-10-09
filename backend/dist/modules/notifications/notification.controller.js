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
import { Controller, Delete, Get, Param, Patch, Put, Req, UseGuards, UseInterceptors, } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service.js';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { UserActiveGuard } from '../../common/guards/user-active.guard.js';
let NotificationController = class NotificationController {
    notificationService;
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    findMe(req) {
        return this.notificationService.findMe(req.user.id);
    }
    markAsRead(req, notificationId) {
        return this.notificationService.markAsRead(req.user.id, notificationId);
    }
    markAllAsRead(req) {
        return this.notificationService.markAllAsRead(req.user.id);
    }
    destroy(req, notificationId) {
        return this.notificationService.destroy(req.user.id, notificationId);
    }
};
__decorate([
    ApiOperation({
        summary: 'Get my notifications',
        description: 'Retrieves all notifications belonging to the authenticated user.',
    }),
    ApiResponse({
        status: 200,
        description: 'Notifications retrieved successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    }),
    Get('me'),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "findMe", null);
__decorate([
    Patch(':id/read'),
    ApiOperation({
        summary: 'Mark notification as read',
        description: 'Marks a specific notification as read. The notification must belong to the authenticated user.',
    }),
    ApiParam({
        name: 'id',
        description: 'Notification ID.',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiResponse({
        status: 200,
        description: 'Notification marked as read successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    }),
    ApiResponse({
        status: 404,
        description: 'Notification not found.',
    }),
    __param(0, Req()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "markAsRead", null);
__decorate([
    Put('read-all'),
    ApiOperation({
        summary: 'Mark all notifications as read',
        description: 'Marks all unread notifications belonging to the authenticated user as read.',
    }),
    ApiResponse({
        status: 200,
        description: 'All notifications marked as read successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    }),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "markAllAsRead", null);
__decorate([
    Delete(':id'),
    ApiOperation({
        summary: 'Delete a notification',
        description: 'Deletes a notification belonging to the authenticated user. Users cannot delete notifications belonging to other users.',
    }),
    ApiParam({
        name: 'id',
        description: 'Notification ID.',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiResponse({
        status: 200,
        description: 'Notification deleted successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    }),
    ApiResponse({
        status: 404,
        description: 'Notification not found.',
    }),
    __param(0, Req()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "destroy", null);
NotificationController = __decorate([
    ApiTags('Notifications'),
    Controller('api/notifications'),
    UseInterceptors(ResponseInterceptor),
    UseGuards(AuthGuard, UserActiveGuard),
    __metadata("design:paramtypes", [NotificationService])
], NotificationController);
export { NotificationController };
//# sourceMappingURL=notification.controller.js.map
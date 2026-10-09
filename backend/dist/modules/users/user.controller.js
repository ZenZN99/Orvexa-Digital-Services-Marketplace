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
import { Body, Controller, Delete, Get, Param, Patch, Query, Req, UseGuards, UseInterceptors, } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { UserActiveGuard } from '../../common/guards/user-active.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { UserService } from './user.service.js';
import { UserRole } from '../../common/enums/user.enum.js';
import { Roles } from '../../common/decorators/role.decorator.js';
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    findAll(page, limit) {
        return this.userService.findAll(Number(page) || 1, Number(limit) || 10);
    }
    findOne(userId) {
        return this.userService.findOne(userId);
    }
    updateRole(userId, role) {
        return this.userService.udpateRole(userId, role);
    }
    block(req, userId) {
        return this.userService.block(req.user.id, userId);
    }
};
__decorate([
    ApiOperation({
        summary: 'Get all users',
        description: 'Returns a paginated list of users ordered by creation date.',
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
        description: 'Number of users per page.',
    }),
    ApiResponse({
        status: 200,
        description: 'Users retrieved successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'Authentication is required.',
    }),
    ApiResponse({
        status: 403,
        description: 'The user account is not authorized to access this resource.',
    }),
    Get(),
    __param(0, Query('page')),
    __param(1, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findAll", null);
__decorate([
    ApiOperation({
        summary: 'Get a user by ID',
        description: 'Returns a user by their unique identifier.',
    }),
    ApiResponse({
        status: 200,
        description: 'User retrieved successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'Authentication is required.',
    }),
    ApiResponse({
        status: 403,
        description: 'The user account is not authorized to access this resource.',
    }),
    ApiResponse({
        status: 404,
        description: 'User not found.',
    }),
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findOne", null);
__decorate([
    ApiOperation({
        summary: 'Update a user role (admin only)',
        description: 'Updates the role of a user. This operation is restricted to administrators.',
    }),
    ApiResponse({
        status: 200,
        description: 'User role updated successfully.',
    }),
    ApiResponse({
        status: 400,
        description: 'Invalid user role.',
    }),
    ApiResponse({
        status: 401,
        description: 'Authentication is required.',
    }),
    ApiResponse({
        status: 403,
        description: 'Administrator privileges are required.',
    }),
    ApiResponse({
        status: 404,
        description: 'User not found.',
    }),
    Patch(':id'),
    UseGuards(AuthGuard, UserActiveGuard, RolesGuard),
    Roles(UserRole.ADMIN),
    __param(0, Param('id')),
    __param(1, Body('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "updateRole", null);
__decorate([
    ApiOperation({
        summary: 'Block a user (admin only)',
        description: 'Deactivates a user account. This operation is restricted to administrators.',
    }),
    ApiResponse({
        status: 200,
        description: 'User blocked successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'Authentication is required.',
    }),
    ApiResponse({
        status: 403,
        description: 'Administrator privileges are required.',
    }),
    ApiResponse({
        status: 404,
        description: 'User not found.',
    }),
    Delete(':id'),
    UseGuards(AuthGuard, UserActiveGuard, RolesGuard),
    Roles(UserRole.ADMIN),
    __param(0, Req()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "block", null);
UserController = __decorate([
    ApiTags('Users'),
    Controller('api/users'),
    UseInterceptors(ResponseInterceptor),
    __metadata("design:paramtypes", [UserService])
], UserController);
export { UserController };
//# sourceMappingURL=user.controller.js.map
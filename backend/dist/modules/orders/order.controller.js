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
import { Controller, Delete, Get, Param, Post, Query, Req, UseGuards, UseInterceptors, } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { UserActiveGuard } from '../../common/guards/user-active.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { OrderService } from './order.service.js';
import { Roles } from '../../common/decorators/role.decorator.js';
import { UserRole } from '../../common/enums/user.enum.js';
let OrderController = class OrderController {
    orderService;
    constructor(orderService) {
        this.orderService = orderService;
    }
    create(req) {
        return this.orderService.create(req.user.id);
    }
    findAll(page, limit) {
        return this.orderService.findAll(Number(page) || 1, Number(limit) || 10);
    }
    findMe(req) {
        return this.orderService.findMe(req.user.id);
    }
    findOne(req, orderId) {
        return this.orderService.findOne(req.user.id, orderId);
    }
    destroy(req, orderId) {
        return this.orderService.destroy(req.user.id, orderId);
    }
};
__decorate([
    ApiOperation({
        summary: 'Create a new order',
        description: 'Creates an order from the authenticated user cart.',
    }),
    ApiResponse({
        status: 201,
        description: 'Order created successfully.',
    }),
    ApiResponse({
        status: 400,
        description: 'Cart is empty.',
    }),
    ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    }),
    Post(),
    Roles(UserRole.CLIENT),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "create", null);
__decorate([
    ApiOperation({
        summary: 'Get all orders',
        description: 'Returns all orders for admin management.',
    }),
    ApiResponse({
        status: 200,
        description: 'Orders retrieved successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    }),
    ApiResponse({
        status: 403,
        description: 'Forbidden. Admin access required.',
    }),
    Get(),
    Roles(UserRole.ADMIN),
    __param(0, Query('page')),
    __param(1, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "findAll", null);
__decorate([
    ApiOperation({
        summary: 'Get my orders',
        description: 'Returns all orders belonging to the authenticated user.',
    }),
    ApiResponse({
        status: 200,
        description: 'Orders retrieved successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    }),
    Get('me'),
    Roles(UserRole.CLIENT),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "findMe", null);
__decorate([
    ApiOperation({
        summary: 'Get order details',
        description: 'Returns details of a specific order belonging to the authenticated user.',
    }),
    ApiParam({
        name: 'orderId',
        description: 'Order ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiResponse({
        status: 200,
        description: 'Order retrieved successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    }),
    ApiResponse({
        status: 404,
        description: 'Order not found.',
    }),
    Get(':id'),
    __param(0, Req()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "findOne", null);
__decorate([
    ApiOperation({
        summary: 'Delete an order',
        description: 'Deletes an order belonging to the authenticated user. Only orders with PENDING_PAYMENT status can be deleted.',
    }),
    ApiParam({
        name: 'orderId',
        description: 'Order ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiResponse({
        status: 200,
        description: 'Order deleted successfully.',
    }),
    ApiResponse({
        status: 400,
        description: 'Only orders with PENDING_PAYMENT status can be deleted.',
    }),
    ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    }),
    ApiResponse({
        status: 404,
        description: 'Order not found.',
    }),
    Delete(':id'),
    Roles(UserRole.CLIENT),
    __param(0, Req()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "destroy", null);
OrderController = __decorate([
    ApiTags('Orders'),
    Controller('api/orders'),
    UseInterceptors(ResponseInterceptor),
    UseGuards(AuthGuard, UserActiveGuard, RolesGuard),
    __metadata("design:paramtypes", [OrderService])
], OrderController);
export { OrderController };
//# sourceMappingURL=order.controller.js.map
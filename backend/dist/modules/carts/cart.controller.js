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
import { Controller, Delete, Get, Param, Post, Req, UseGuards, UseInterceptors, } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { UserActiveGuard } from '../../common/guards/user-active.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { CartService } from './cart.service.js';
import { Roles } from '../../common/decorators/role.decorator.js';
import { UserRole } from '../../common/enums/user.enum.js';
let CartController = class CartController {
    cartService;
    constructor(cartService) {
        this.cartService = cartService;
    }
    findMe(req) {
        return this.cartService.findMe(req.user.id);
    }
    addItem(req, serviceId) {
        return this.cartService.addItem(req.user.id, serviceId);
    }
    removeItem(req, serviceId) {
        return this.cartService.removeItem(req.user.id, serviceId);
    }
    clearCart(req) {
        return this.cartService.clearCart(req.user.id);
    }
};
__decorate([
    ApiOperation({
        summary: 'Get current user cart',
        description: 'Returns the authenticated client cart and its items.',
    }),
    ApiResponse({
        status: 200,
        description: 'Cart retrieved successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    }),
    ApiResponse({
        status: 403,
        description: 'Forbidden. Only clients can access this endpoint.',
    }),
    Get('me'),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "findMe", null);
__decorate([
    ApiOperation({
        summary: 'Add a service to cart',
        description: 'Adds a published service to the authenticated client cart.',
    }),
    ApiParam({
        name: 'serviceId',
        description: 'Service UUID.',
        type: String,
        format: 'uuid',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiResponse({
        status: 201,
        description: 'Service added to cart successfully.',
    }),
    ApiResponse({
        status: 400,
        description: 'Service is already in the cart or belongs to the client.',
    }),
    ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    }),
    ApiResponse({
        status: 403,
        description: 'Forbidden. Only clients can add services to cart.',
    }),
    ApiResponse({
        status: 404,
        description: 'Service not found or is not published.',
    }),
    Post(':serviceId'),
    __param(0, Req()),
    __param(1, Param('serviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "addItem", null);
__decorate([
    ApiOperation({
        summary: 'Remove a service from cart',
        description: 'Removes a service from the authenticated client cart.',
    }),
    ApiParam({
        name: 'serviceId',
        description: 'Service UUID.',
        type: String,
        format: 'uuid',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiResponse({
        status: 200,
        description: 'Service removed from cart successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    }),
    ApiResponse({
        status: 403,
        description: 'Forbidden. Only clients can remove services from cart.',
    }),
    ApiResponse({
        status: 404,
        description: 'Cart or cart item not found.',
    }),
    Delete(':serviceId'),
    __param(0, Req()),
    __param(1, Param('serviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "removeItem", null);
__decorate([
    ApiOperation({
        summary: 'Clear cart',
        description: 'Removes all services from the authenticated client cart.',
    }),
    ApiResponse({
        status: 200,
        description: 'Cart cleared successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    }),
    ApiResponse({
        status: 403,
        description: 'Forbidden. Only clients can clear their cart.',
    }),
    ApiResponse({
        status: 404,
        description: 'Cart not found.',
    }),
    Delete(),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "clearCart", null);
CartController = __decorate([
    ApiTags('Carts'),
    Controller('api/carts'),
    UseInterceptors(ResponseInterceptor),
    UseGuards(AuthGuard, UserActiveGuard, RolesGuard),
    Roles(UserRole.CLIENT),
    __metadata("design:paramtypes", [CartService])
], CartController);
export { CartController };
//# sourceMappingURL=cart.controller.js.map
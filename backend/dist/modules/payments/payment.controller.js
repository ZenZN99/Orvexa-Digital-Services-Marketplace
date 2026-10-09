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
import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards, UseInterceptors, } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, } from '@nestjs/swagger';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { UserActiveGuard } from '../../common/guards/user-active.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { PaymentService } from './payment.service.js';
import { Roles } from '../../common/decorators/role.decorator.js';
import { UserRole } from '../../common/enums/user.enum.js';
import { UserVerificationGuard } from '../../common/guards/user-verification.guard.js';
let PaymentController = class PaymentController {
    paymentService;
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    pay(req, orderId) {
        return this.paymentService.pay(req.user.id, orderId);
    }
    findAll(page, limit) {
        return this.paymentService.findAll(Number(page) || 1, Number(limit) || 10);
    }
    findMe(req) {
        return this.paymentService.findMe(req.user.id);
    }
    findOne(req, paymentId) {
        return this.paymentService.findOne(req.user.id, paymentId);
    }
    rechargeBalance(req, amount) {
        return this.paymentService.rechargeBalance(req.user.id, amount);
    }
};
__decorate([
    ApiOperation({
        summary: 'Pay for an order',
        description: 'Completes the payment for a pending order using the authenticated client balance.',
    }),
    ApiParam({
        name: 'orderId',
        description: 'Order ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiResponse({
        status: 201,
        description: 'Payment completed successfully.',
    }),
    ApiResponse({
        status: 400,
        description: 'Order has already been processed, insufficient balance, or order payment failed.',
    }),
    ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    }),
    ApiResponse({
        status: 403,
        description: 'Forbidden. Client access required.',
    }),
    ApiResponse({
        status: 404,
        description: 'Order not found.',
    }),
    Post(':orderId'),
    Roles(UserRole.CLIENT),
    __param(0, Req()),
    __param(1, Param('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "pay", null);
__decorate([
    ApiOperation({
        summary: 'Get all payments',
        description: 'Returns all payments for admin management with pagination.',
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
        description: 'Number of payments per page.',
    }),
    ApiResponse({
        status: 200,
        description: 'All payments retrieved successfully.',
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
], PaymentController.prototype, "findAll", null);
__decorate([
    ApiOperation({
        summary: 'Get my payments',
        description: 'Returns all payments made by the authenticated client.',
    }),
    ApiResponse({
        status: 200,
        description: 'Payments retrieved successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    }),
    ApiResponse({
        status: 403,
        description: 'Forbidden. Client access required.',
    }),
    Get('me'),
    Roles(UserRole.CLIENT),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "findMe", null);
__decorate([
    ApiOperation({
        summary: 'Get payment details',
        description: 'Returns details of a specific payment belonging to the authenticated client.',
    }),
    ApiParam({
        name: 'id',
        description: 'Payment ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiResponse({
        status: 200,
        description: 'Payment retrieved successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    }),
    ApiResponse({
        status: 403,
        description: 'Forbidden. Client access required.',
    }),
    ApiResponse({
        status: 404,
        description: 'Payment not found.',
    }),
    Get(':id'),
    Roles(UserRole.CLIENT),
    __param(0, Req()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "findOne", null);
__decorate([
    ApiOperation({
        summary: 'Recharge balance',
        description: "Adds the specified amount to the authenticated client's balance.",
    }),
    ApiBody({
        schema: {
            type: 'object',
            properties: {
                amount: {
                    type: 'number',
                    example: 100,
                    description: "Amount to add to the client's balance.",
                    minimum: 0.01,
                },
            },
            required: ['amount'],
        },
    }),
    ApiResponse({
        status: 200,
        description: 'Balance recharged successfully.',
    }),
    ApiResponse({
        status: 400,
        description: 'Invalid recharge amount.',
    }),
    ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    }),
    ApiResponse({
        status: 403,
        description: 'Forbidden. Client access required.',
    }),
    ApiResponse({
        status: 404,
        description: 'User not found.',
    }),
    Patch('recharge-balance'),
    Roles(UserRole.CLIENT),
    __param(0, Req()),
    __param(1, Body('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "rechargeBalance", null);
PaymentController = __decorate([
    ApiTags('Payments'),
    Controller('api/payments'),
    UseInterceptors(ResponseInterceptor),
    UseGuards(AuthGuard, UserActiveGuard, RolesGuard, UserVerificationGuard),
    __metadata("design:paramtypes", [PaymentService])
], PaymentController);
export { PaymentController };
//# sourceMappingURL=payment.controller.js.map
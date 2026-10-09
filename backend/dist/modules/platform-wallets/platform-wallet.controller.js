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
import { Body, Controller, Get, Post, Req, UseGuards, UseInterceptors, } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags, } from '@nestjs/swagger';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { UserActiveGuard } from '../../common/guards/user-active.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/role.decorator.js';
import { UserRole } from '../../common/enums/user.enum.js';
import { PlatformWalletService } from './platform-wallet.service.js';
import { UserVerificationGuard } from '../../common/guards/user-verification.guard.js';
let PlatformWalletController = class PlatformWalletController {
    platformWalletService;
    constructor(platformWalletService) {
        this.platformWalletService = platformWalletService;
    }
    findBalance() {
        return this.platformWalletService.findBalance();
    }
    withdraw(req, amount) {
        return this.platformWalletService.withdraw(req.user.id, amount);
    }
};
__decorate([
    ApiOperation({
        summary: 'Get platform wallet balance',
        description: 'Retrieves the current balance of the platform wallet. This endpoint is available to administrators only.',
    }),
    ApiResponse({
        status: 200,
        description: 'Platform wallet balance retrieved successfully.',
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
        description: 'Platform wallet not found.',
    }),
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformWalletController.prototype, "findBalance", null);
__decorate([
    ApiOperation({
        summary: 'Withdraw from platform wallet',
        description: 'Withdraws money from the platform wallet and transfers it to the authenticated administrator account.',
    }),
    ApiBody({
        schema: {
            type: 'object',
            required: ['amount'],
            properties: {
                amount: {
                    type: 'number',
                    example: 100,
                    minimum: 0.01,
                    description: 'Amount to withdraw from the platform wallet.',
                },
            },
        },
    }),
    ApiResponse({
        status: 200,
        description: 'Platform balance withdrawn successfully.',
    }),
    ApiResponse({
        status: 400,
        description: 'Insufficient platform wallet balance or invalid withdrawal amount.',
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
        description: 'Platform wallet not found or admin user not found.',
    }),
    Post(),
    UseGuards(UserVerificationGuard),
    __param(0, Req()),
    __param(1, Body('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], PlatformWalletController.prototype, "withdraw", null);
PlatformWalletController = __decorate([
    ApiTags('Platform Wallet'),
    ApiBearerAuth(),
    Controller('api/platform-wallets'),
    UseInterceptors(ResponseInterceptor),
    UseGuards(AuthGuard, UserActiveGuard, RolesGuard),
    Roles(UserRole.ADMIN),
    __metadata("design:paramtypes", [PlatformWalletService])
], PlatformWalletController);
export { PlatformWalletController };
//# sourceMappingURL=platform-wallet.controller.js.map
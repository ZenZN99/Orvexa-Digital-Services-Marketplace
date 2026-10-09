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
import { Controller, Get, Param, Post, Query, Req, UseGuards, UseInterceptors, } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, } from '@nestjs/swagger';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { UserActiveGuard } from '../../common/guards/user-active.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { ContractService } from './contract.service.js';
import { Roles } from '../../common/decorators/role.decorator.js';
import { UserRole } from '../../common/enums/user.enum.js';
import { UserVerificationGuard } from '../../common/guards/user-verification.guard.js';
let ContractController = class ContractController {
    contractService;
    constructor(contractService) {
        this.contractService = contractService;
    }
    findMe(req) {
        return this.contractService.findMe(req.user.id);
    }
    findAll(page, limit) {
        return this.contractService.findAll(Number(page) || 1, Number(limit) || 10);
    }
    findOne(req, contractId) {
        return this.contractService.findOne(req.user.id, contractId);
    }
    complete(req, contractId) {
        return this.contractService.complete(req.user.id, contractId);
    }
    deliver(req, contractId) {
        return this.contractService.deliver(req.user.id, contractId);
    }
};
__decorate([
    ApiOperation({
        summary: 'Get my contracts',
        description: 'Retrieves all contracts associated with the authenticated user as a client or freelancer.',
    }),
    ApiResponse({
        status: 200,
        description: 'Contracts retrieved successfully.',
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
], ContractController.prototype, "findMe", null);
__decorate([
    ApiOperation({
        summary: 'Get all contracts',
        description: 'Retrieves all contracts with pagination. Admin access is required.',
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
        description: 'Number of contracts per page.',
    }),
    ApiResponse({
        status: 200,
        description: 'All contracts retrieved successfully.',
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
], ContractController.prototype, "findAll", null);
__decorate([
    ApiOperation({
        summary: 'Get a contract',
        description: 'Retrieves a contract by ID for the authenticated client or freelancer.',
    }),
    ApiParam({
        name: 'id',
        description: 'Contract ID.',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiResponse({
        status: 200,
        description: 'Contract retrieved successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    }),
    ApiResponse({
        status: 404,
        description: 'Contract not found.',
    }),
    Get(':id'),
    __param(0, Req()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ContractController.prototype, "findOne", null);
__decorate([
    ApiOperation({
        summary: 'Complete a contract',
        description: 'Completes a delivered contract and releases the payment to the freelancer. Client access is required.',
    }),
    ApiParam({
        name: 'id',
        description: 'Contract ID.',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiResponse({
        status: 201,
        description: 'Service completed successfully.',
    }),
    ApiResponse({
        status: 400,
        description: 'Contract is not delivered or there is insufficient frozen balance.',
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
        description: 'Contract not found.',
    }),
    Post('complete/:id'),
    UseGuards(UserVerificationGuard),
    Roles(UserRole.CLIENT),
    __param(0, Req()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ContractController.prototype, "complete", null);
__decorate([
    ApiOperation({
        summary: 'Deliver a contract',
        description: 'Marks a contract as delivered by the assigned freelancer.',
    }),
    ApiParam({
        name: 'id',
        description: 'Contract ID.',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiResponse({
        status: 201,
        description: 'Contract delivered successfully.',
    }),
    ApiResponse({
        status: 400,
        description: 'Only contracts in progress can be marked as delivered.',
    }),
    ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    }),
    ApiResponse({
        status: 404,
        description: 'Contract not found.',
    }),
    Post('deliver/:id'),
    __param(0, Req()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ContractController.prototype, "deliver", null);
ContractController = __decorate([
    ApiTags('Contracts'),
    Controller('api/contracts'),
    UseInterceptors(ResponseInterceptor),
    UseGuards(AuthGuard, UserActiveGuard, RolesGuard),
    __metadata("design:paramtypes", [ContractService])
], ContractController);
export { ContractController };
//# sourceMappingURL=contract.controller.js.map
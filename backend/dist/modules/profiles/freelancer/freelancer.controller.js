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
import { Body, Controller, Get, Param, Put, Req, UseGuards, UseInterceptors, } from '@nestjs/common';
import { ResponseInterceptor } from '../../../common/interceptors/response.interceptor.js';
import { AuthGuard } from '../../../common/guards/auth.guard.js';
import { UserActiveGuard } from '../../../common/guards/user-active.guard.js';
import { RolesGuard } from '../../../common/guards/roles.guard.js';
import { FreelancerService } from './freelancer.service.js';
import { Roles } from '../../../common/decorators/role.decorator.js';
import { UserRole } from '../../../common/enums/user.enum.js';
import { UpdateFreelancerDTO } from './dto/update.js';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags, } from '@nestjs/swagger';
let FreelancerController = class FreelancerController {
    freelancerService;
    constructor(freelancerService) {
        this.freelancerService = freelancerService;
    }
    findMe(req) {
        return this.freelancerService.findMe(req.user.id);
    }
    findOne(userId) {
        return this.freelancerService.findOne(userId);
    }
    update(req, data) {
        return this.freelancerService.update(req.user.id, data);
    }
};
__decorate([
    ApiOperation({
        summary: 'Get my freelancer profile',
        description: 'Returns the freelancer profile associated with the currently authenticated user.',
    }),
    ApiResponse({
        status: 200,
        description: 'Freelancer profile retrieved successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'Authentication is required.',
    }),
    ApiResponse({
        status: 403,
        description: 'The user account is not active.',
    }),
    ApiResponse({
        status: 404,
        description: 'Freelancer profile not found.',
    }),
    Get(),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FreelancerController.prototype, "findMe", null);
__decorate([
    ApiOperation({
        summary: 'Get a freelancer profile',
        description: 'Returns a freelancer profile using the associated user ID.',
    }),
    ApiParam({
        name: 'id',
        description: 'User ID associated with the freelancer profile.',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiResponse({
        status: 200,
        description: 'Freelancer profile retrieved successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'Authentication is required.',
    }),
    ApiResponse({
        status: 403,
        description: 'The user account is not active.',
    }),
    ApiResponse({
        status: 404,
        description: 'Freelancer profile not found.',
    }),
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FreelancerController.prototype, "findOne", null);
__decorate([
    ApiOperation({
        summary: 'Update my freelancer profile',
        description: 'Updates the freelancer profile of the currently authenticated freelancer.',
    }),
    ApiBody({
        type: UpdateFreelancerDTO,
    }),
    ApiResponse({
        status: 200,
        description: 'Freelancer profile updated successfully.',
    }),
    ApiResponse({
        status: 400,
        description: 'Invalid freelancer profile data.',
    }),
    ApiResponse({
        status: 401,
        description: 'Authentication is required.',
    }),
    ApiResponse({
        status: 403,
        description: 'The account must have the freelancer role and be active.',
    }),
    ApiResponse({
        status: 404,
        description: 'Freelancer profile not found.',
    }),
    Put(),
    Roles(UserRole.FREELANCER),
    __param(0, Req()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UpdateFreelancerDTO]),
    __metadata("design:returntype", void 0)
], FreelancerController.prototype, "update", null);
FreelancerController = __decorate([
    ApiTags('Freelancers'),
    Controller('api/freelancers'),
    UseInterceptors(ResponseInterceptor),
    UseGuards(AuthGuard, UserActiveGuard, RolesGuard),
    __metadata("design:paramtypes", [FreelancerService])
], FreelancerController);
export { FreelancerController };
//# sourceMappingURL=freelancer.controller.js.map
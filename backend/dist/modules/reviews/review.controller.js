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
import { Body, Controller, Get, Param, Post, Query, Req, UseGuards, UseInterceptors, } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, } from '@nestjs/swagger';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { UserActiveGuard } from '../../common/guards/user-active.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { ReviewService } from './review.service.js';
import { CreateReviewDTO } from './dto/create.js';
import { Roles } from '../../common/decorators/role.decorator.js';
import { UserRole } from '../../common/enums/user.enum.js';
let ReviewController = class ReviewController {
    reviewService;
    constructor(reviewService) {
        this.reviewService = reviewService;
    }
    create(req, contractId, data) {
        return this.reviewService.create(req.user.id, contractId, data);
    }
    findMe(req, page, limit) {
        return this.reviewService.findMe(req.user.id, Number(page) || 1, Number(limit) || 10);
    }
    async findByFreelancer(freelancerId, page, limit) {
        return this.reviewService.findByFreelancer(freelancerId, Number(page) || 1, Number(limit) || 10);
    }
    findAllByService(serviceId, page, limit) {
        return this.reviewService.findAllByService(serviceId, Number(page) || 1, Number(limit) || 10);
    }
    findOne(reviewId) {
        return this.reviewService.findOne(reviewId);
    }
};
__decorate([
    ApiOperation({
        summary: 'Create a review',
        description: 'Create a review for a completed contract.',
    }),
    ApiResponse({
        status: 201,
        description: 'Review created successfully.',
    }),
    ApiResponse({
        status: 400,
        description: 'Contract is not completed or has already been reviewed.',
    }),
    ApiResponse({
        status: 404,
        description: 'Contract not found.',
    }),
    Post(':contractId'),
    Roles(UserRole.CLIENT),
    __param(0, Req()),
    __param(1, Param('contractId')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, CreateReviewDTO]),
    __metadata("design:returntype", void 0)
], ReviewController.prototype, "create", null);
__decorate([
    ApiOperation({
        summary: 'Get my reviews',
        description: 'Returns paginated reviews for all services belonging to the authenticated freelancer.',
    }),
    ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        example: 1,
        description: 'Page number',
    }),
    ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        example: 10,
        description: 'Number of reviews per page',
    }),
    ApiResponse({
        status: 200,
        description: 'Reviews fetched successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'Unauthorized.',
    }),
    Get('me'),
    __param(0, Req()),
    __param(1, Query('page')),
    __param(2, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], ReviewController.prototype, "findMe", null);
__decorate([
    ApiOperation({
        summary: 'Get freelancer reviews',
        description: 'Returns paginated reviews for all services belonging to the specified freelancer.',
    }),
    ApiParam({
        name: 'freelancerId',
        type: String,
        description: 'Freelancer ID',
    }),
    ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        example: 1,
        description: 'Page number',
    }),
    ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        example: 10,
        description: 'Number of reviews per page',
    }),
    ApiResponse({
        status: 200,
        description: 'Freelancer reviews fetched successfully.',
    }),
    ApiResponse({
        status: 404,
        description: 'Freelancer not found.',
    }),
    Get('freelancer/:freelancerId'),
    __param(0, Param('freelancerId')),
    __param(1, Query('page')),
    __param(2, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "findByFreelancer", null);
__decorate([
    ApiOperation({
        summary: 'Get all reviews for a service',
        description: 'Returns paginated reviews for the specified service.',
    }),
    ApiParam({
        name: 'serviceId',
        description: 'Service ID',
        type: String,
    }),
    ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        example: 1,
        description: 'Page number',
    }),
    ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        example: 10,
        description: 'Number of reviews per page',
    }),
    ApiResponse({
        status: 200,
        description: 'Reviews fetched successfully.',
    }),
    ApiResponse({
        status: 404,
        description: 'Service not found.',
    }),
    Get('all/:serviceId'),
    __param(0, Param('serviceId')),
    __param(1, Query('page')),
    __param(2, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ReviewController.prototype, "findAllByService", null);
__decorate([
    ApiOperation({
        summary: 'Get a review by ID',
        description: 'Returns a single review by its ID.',
    }),
    ApiParam({
        name: 'id',
        description: 'Review ID',
        type: String,
    }),
    ApiResponse({
        status: 200,
        description: 'Review fetched successfully.',
    }),
    ApiResponse({
        status: 404,
        description: 'Review not found.',
    }),
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReviewController.prototype, "findOne", null);
ReviewController = __decorate([
    ApiTags('Reviews'),
    Controller('api/reviews'),
    UseInterceptors(ResponseInterceptor),
    UseGuards(AuthGuard, UserActiveGuard, RolesGuard),
    __metadata("design:paramtypes", [ReviewService])
], ReviewController);
export { ReviewController };
//# sourceMappingURL=review.controller.js.map
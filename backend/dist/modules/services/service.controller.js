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
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFiles, UseGuards, UseInterceptors, } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, } from '@nestjs/swagger';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { UserActiveGuard } from '../../common/guards/user-active.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { ServiceService } from './service.service.js';
import { CreateServiceDTO } from './dto/create.js';
import { ServiceCategory, ServiceStatus, } from '../../common/enums/service.enum.js';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from '../../common/decorators/role.decorator.js';
import { UserRole } from '../../common/enums/user.enum.js';
import { UpdateServiceDTO } from './dto/update.js';
import { UserVerificationGuard } from '../../common/guards/user-verification.guard.js';
let ServiceController = class ServiceController {
    serviceService;
    constructor(serviceService) {
        this.serviceService = serviceService;
    }
    create(req, data, images) {
        return this.serviceService.create(req.user.id, data, images);
    }
    findAll(page, limit) {
        return this.serviceService.findAll(Number(page) || 1, Number(limit) || 10);
    }
    findMe(req) {
        return this.serviceService.findMe(req.user.id);
    }
    findByFreelancer(userId) {
        return this.serviceService.findByFreelancer(userId);
    }
    findPending(page, limit) {
        return this.serviceService.findPending(Number(page) || 1, Number(limit) || 10);
    }
    findOne(serviceId) {
        return this.serviceService.findOne(serviceId);
    }
    update(req, serviceId, data, images) {
        return this.serviceService.update(req.user.id, serviceId, data, images);
    }
    updateStatus(serviceId, req, status, reason) {
        return this.serviceService.updateStatus(serviceId, req.user.id, status, reason);
    }
    destroy(req, serviceId) {
        return this.serviceService.destroy(req.user, serviceId);
    }
};
__decorate([
    ApiOperation({
        summary: 'Create a new service',
        description: 'Creates a new service for the authenticated freelancer and submits it for review.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
        description: 'Service information and images.',
        schema: {
            type: 'object',
            properties: {
                category: {
                    type: 'string',
                    enum: Object.values(ServiceCategory),
                    example: ServiceCategory.PROGRAMMING,
                },
                title: {
                    type: 'string',
                    example: 'I will develop a professional REST API using NestJS',
                },
                description: {
                    type: 'string',
                    example: 'I will develop a secure and scalable REST API using NestJS and PostgreSQL.',
                },
                features: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                    example: [
                        'RESTful API',
                        'JWT Authentication',
                        'PostgreSQL Database',
                        'Swagger Documentation',
                    ],
                },
                keywords: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                    example: ['NestJS', 'Node.js', 'PostgreSQL', 'Angular'],
                },
                price: {
                    type: 'number',
                    example: 50,
                },
                deliveryDays: {
                    type: 'integer',
                    example: 5,
                },
                images: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                    description: 'Service images. Maximum 5 images.',
                },
            },
            required: [
                'category',
                'title',
                'description',
                'features',
                'keywords',
                'price',
                'deliveryDays',
            ],
        },
    }),
    ApiResponse({
        status: 201,
        description: 'Service created successfully.',
    }),
    ApiResponse({
        status: 400,
        description: 'Invalid service data or images.',
    }),
    ApiResponse({
        status: 401,
        description: 'Authentication is required.',
    }),
    ApiResponse({
        status: 403,
        description: 'Only active freelancers can create services.',
    }),
    ApiResponse({
        status: 404,
        description: 'Freelancer profile not found.',
    }),
    Post(),
    UseGuards(AuthGuard, UserActiveGuard, RolesGuard, UserVerificationGuard),
    Roles(UserRole.FREELANCER),
    UseInterceptors(FilesInterceptor('images', 5)),
    __param(0, Req()),
    __param(1, Body()),
    __param(2, UploadedFiles()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateServiceDTO, Array]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "create", null);
__decorate([
    ApiOperation({
        summary: 'Get all services',
        description: 'Returns a paginated list of all services.',
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
        description: 'Number of services per page.',
    }),
    ApiResponse({
        status: 200,
        description: 'Services retrieved successfully.',
    }),
    Get(),
    __param(0, Query('page')),
    __param(1, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "findAll", null);
__decorate([
    ApiOperation({
        summary: 'Get my services',
        description: 'Returns all services created by the authenticated freelancer.',
    }),
    ApiResponse({
        status: 200,
        description: 'Services retrieved successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'Authentication is required.',
    }),
    ApiResponse({
        status: 404,
        description: 'Freelancer profile not found.',
    }),
    Get('me'),
    UseGuards(AuthGuard, UserActiveGuard),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "findMe", null);
__decorate([
    ApiOperation({
        summary: 'Get freelancer services',
        description: 'Returns all services created by the authenticated freelancer.',
    }),
    ApiResponse({
        status: 200,
        description: 'Services retrieved successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'Authentication is required.',
    }),
    ApiResponse({
        status: 404,
        description: 'Freelancer profile not found.',
    }),
    Get('freelancer/:userId'),
    UseGuards(AuthGuard, UserActiveGuard),
    __param(0, Param('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "findByFreelancer", null);
__decorate([
    ApiOperation({
        summary: 'Get pending services (admin only)',
        description: 'Returns a paginated list of services pending admin review.',
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
        description: 'Number of services per page.',
    }),
    ApiResponse({
        status: 200,
        description: 'Pending services retrieved successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'Authentication is required.',
    }),
    ApiResponse({
        status: 403,
        description: 'Only administrators can access this resource.',
    }),
    Get('pending'),
    UseGuards(AuthGuard, UserActiveGuard, RolesGuard),
    Roles(UserRole.ADMIN),
    __param(0, Query('page')),
    __param(1, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "findPending", null);
__decorate([
    ApiOperation({
        summary: 'Get service by ID',
        description: 'Returns a service by its unique identifier.',
    }),
    ApiParam({
        name: 'id',
        type: String,
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Service unique identifier.',
    }),
    ApiResponse({
        status: 200,
        description: 'Service retrieved successfully.',
    }),
    ApiResponse({
        status: 404,
        description: 'Service not found.',
    }),
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "findOne", null);
__decorate([
    ApiOperation({
        summary: 'Update a service',
        description: 'Updates an existing service owned by the authenticated freelancer and submits it for review again.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiParam({
        name: 'id',
        type: String,
        format: 'uuid',
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Service unique identifier.',
    }),
    ApiBody({
        description: 'Service data and optional images.',
        schema: {
            type: 'object',
            properties: {
                category: {
                    type: 'string',
                    enum: Object.values(ServiceCategory),
                    example: ServiceCategory.PROGRAMMING,
                },
                title: {
                    type: 'string',
                    example: 'I will develop a professional REST API using NestJS',
                },
                description: {
                    type: 'string',
                    example: 'I will develop a secure and scalable REST API using NestJS and PostgreSQL.',
                },
                features: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                    example: ['RESTful API', 'JWT Authentication', 'PostgreSQL Database'],
                },
                keywords: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                    example: ['NestJS', 'Node.js', 'PostgreSQL', 'Backend'],
                },
                price: {
                    type: 'number',
                    example: 50,
                },
                deliveryDays: {
                    type: 'integer',
                    example: 5,
                },
                images: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                    description: 'Service images. Maximum 5 images.',
                },
            },
        },
    }),
    ApiResponse({
        status: 200,
        description: 'Service updated successfully.',
    }),
    ApiResponse({
        status: 400,
        description: 'Invalid service data or images.',
    }),
    ApiResponse({
        status: 401,
        description: 'Authentication is required.',
    }),
    ApiResponse({
        status: 404,
        description: 'Service or freelancer profile not found.',
    }),
    Put(':id'),
    UseInterceptors(FilesInterceptor('images', 5)),
    UseGuards(AuthGuard, UserActiveGuard),
    __param(0, Req()),
    __param(1, Param('id')),
    __param(2, Body()),
    __param(3, UploadedFiles()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateServiceDTO, Array]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "update", null);
__decorate([
    ApiOperation({
        summary: 'Update service status',
        description: 'Updates the status of a service. A rejection reason is required when rejecting a service.',
    }),
    ApiParam({
        name: 'id',
        type: String,
        format: 'uuid',
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Service unique identifier.',
    }),
    ApiBody({
        schema: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: Object.values(ServiceStatus),
                    example: ServiceStatus.PUBLISHED,
                    description: 'New status of the service.',
                },
                reason: {
                    type: 'string',
                    example: 'The service description does not meet the marketplace guidelines.',
                    description: 'Required when the service is rejected.',
                },
            },
            required: ['status'],
        },
    }),
    ApiResponse({
        status: 200,
        description: 'Service status updated successfully.',
    }),
    ApiResponse({
        status: 400,
        description: 'A rejection reason is required when rejecting a service.',
    }),
    ApiResponse({
        status: 401,
        description: 'Authentication is required.',
    }),
    ApiResponse({
        status: 403,
        description: 'Only administrators can update service status.',
    }),
    ApiResponse({
        status: 404,
        description: 'Service not found.',
    }),
    Put(':id/status'),
    UseGuards(AuthGuard, UserActiveGuard, RolesGuard),
    Roles(UserRole.ADMIN),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Body('status')),
    __param(3, Body('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "updateStatus", null);
__decorate([
    ApiOperation({
        summary: 'Delete a service',
        description: 'Deletes a service owned by the authenticated freelancer or by an administrator.',
    }),
    ApiParam({
        name: 'id',
        type: String,
        format: 'uuid',
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Service unique identifier.',
    }),
    ApiResponse({
        status: 200,
        description: 'Service deleted successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'Authentication is required.',
    }),
    ApiResponse({
        status: 403,
        description: 'You are not authorized to delete this service.',
    }),
    ApiResponse({
        status: 404,
        description: 'Service not found.',
    }),
    Delete(':id'),
    UseGuards(AuthGuard, UserActiveGuard),
    __param(0, Req()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "destroy", null);
ServiceController = __decorate([
    ApiTags('Services'),
    Controller('api/services'),
    UseInterceptors(ResponseInterceptor),
    __metadata("design:paramtypes", [ServiceService])
], ServiceController);
export { ServiceController };
//# sourceMappingURL=service.controller.js.map
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { UserActiveGuard } from '../../common/guards/user-active.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { ServiceService } from './service.service.js';
import type { RequestWithUser } from '../../types/express.js';
import { CreateServiceDTO } from './dto/create.js';
import {
  ServiceCategory,
  ServiceStatus,
} from '../../common/enums/service.enum.js';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from '../../common/decorators/role.decorator.js';
import { UserRole } from '../../common/enums/user.enum.js';
import { UpdateServiceDTO } from './dto/update.js';
import { UserVerificationGuard } from '../../common/guards/user-verification.guard.js';

@ApiTags('Services')
@Controller('api/services')
@UseInterceptors(ResponseInterceptor)
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @ApiOperation({
    summary: 'Create a new service',
    description:
      'Creates a new service for the authenticated freelancer and submits it for review.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
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
          example:
            'I will develop a secure and scalable REST API using NestJS and PostgreSQL.',
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
  })
  @ApiResponse({
    status: 201,
    description: 'Service created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid service data or images.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Only active freelancers can create services.',
  })
  @ApiResponse({
    status: 404,
    description: 'Freelancer profile not found.',
  })
  @Post()
  @UseGuards(AuthGuard, UserActiveGuard, RolesGuard, UserVerificationGuard)
  @Roles(UserRole.FREELANCER)
  @UseInterceptors(FilesInterceptor('images', 5))
  create(
    @Req() req: RequestWithUser,
    @Body() data: CreateServiceDTO,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.serviceService.create(req.user.id, data, images);
  }

  @ApiOperation({
    summary: 'Get all services',
    description: 'Returns a paginated list of all services.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Number of services per page.',
  })
  @ApiResponse({
    status: 200,
    description: 'Services retrieved successfully.',
  })
  @Get()
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    return this.serviceService.findAll(Number(page) || 1, Number(limit) || 10);
  }

  @ApiOperation({
    summary: 'Get my services',
    description:
      'Returns all services created by the authenticated freelancer.',
  })
  @ApiResponse({
    status: 200,
    description: 'Services retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required.',
  })
  @ApiResponse({
    status: 404,
    description: 'Freelancer profile not found.',
  })
  @Get('me')
  @UseGuards(AuthGuard, UserActiveGuard)
  findMe(@Req() req: RequestWithUser) {
    return this.serviceService.findMe(req.user.id);
  }

  @ApiOperation({
    summary: 'Get freelancer services',
    description:
      'Returns all services created by the authenticated freelancer.',
  })
  @ApiResponse({
    status: 200,
    description: 'Services retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required.',
  })
  @ApiResponse({
    status: 404,
    description: 'Freelancer profile not found.',
  })
  @Get('freelancer/:userId')
  @UseGuards(AuthGuard, UserActiveGuard)
  findByFreelancer(@Param('userId') userId: string) {
    return this.serviceService.findByFreelancer(userId);
  }

  @ApiOperation({
    summary: 'Get pending services (admin only)',
    description: 'Returns a paginated list of services pending admin review.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Number of services per page.',
  })
  @ApiResponse({
    status: 200,
    description: 'Pending services retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Only administrators can access this resource.',
  })
  @Get('pending')
  @UseGuards(AuthGuard, UserActiveGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findPending(@Query('page') page: string, @Query('limit') limit: string) {
    return this.serviceService.findPending(
      Number(page) || 1,
      Number(limit) || 10,
    );
  }

  @ApiOperation({
    summary: 'Get service by ID',
    description: 'Returns a service by its unique identifier.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Service unique identifier.',
  })
  @ApiResponse({
    status: 200,
    description: 'Service retrieved successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found.',
  })
  @Get(':id')
  findOne(@Param('id') serviceId: string) {
    return this.serviceService.findOne(serviceId);
  }

  @ApiOperation({
    summary: 'Update a service',
    description:
      'Updates an existing service owned by the authenticated freelancer and submits it for review again.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Service unique identifier.',
  })
  @ApiBody({
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
          example:
            'I will develop a secure and scalable REST API using NestJS and PostgreSQL.',
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
  })
  @ApiResponse({
    status: 200,
    description: 'Service updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid service data or images.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required.',
  })
  @ApiResponse({
    status: 404,
    description: 'Service or freelancer profile not found.',
  })
  @Put(':id')
  @UseInterceptors(FilesInterceptor('images', 5))
  @UseGuards(AuthGuard, UserActiveGuard)
  update(
    @Req() req: RequestWithUser,
    @Param('id') serviceId: string,
    @Body() data: UpdateServiceDTO,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.serviceService.update(req.user.id, serviceId, data, images);
  }

  @ApiOperation({
    summary: 'Update service status',
    description:
      'Updates the status of a service. A rejection reason is required when rejecting a service.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Service unique identifier.',
  })
  @ApiBody({
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
          example:
            'The service description does not meet the marketplace guidelines.',
          description: 'Required when the service is rejected.',
        },
      },
      required: ['status'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Service status updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'A rejection reason is required when rejecting a service.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Only administrators can update service status.',
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found.',
  })
  @Put(':id/status')
  @UseGuards(AuthGuard, UserActiveGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateStatus(
    @Param('id') serviceId: string,
    @Req() req: RequestWithUser,
    @Body('status') status: ServiceStatus,
    @Body('reason') reason?: string,
  ) {
    return this.serviceService.updateStatus(
      serviceId,
      req.user.id,
      status,
      reason,
    );
  }

  @ApiOperation({
    summary: 'Delete a service',
    description:
      'Deletes a service owned by the authenticated freelancer or by an administrator.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Service unique identifier.',
  })
  @ApiResponse({
    status: 200,
    description: 'Service deleted successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required.',
  })
  @ApiResponse({
    status: 403,
    description: 'You are not authorized to delete this service.',
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found.',
  })
  @Delete(':id')
  @UseGuards(AuthGuard, UserActiveGuard)
  destroy(@Req() req: RequestWithUser, @Param('id') serviceId: string) {
    return this.serviceService.destroy(req.user, serviceId);
  }
}

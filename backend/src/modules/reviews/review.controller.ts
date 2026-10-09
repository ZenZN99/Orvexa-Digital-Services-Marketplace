import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
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
import { ReviewService } from './review.service.js';
import type { RequestWithUser } from '../../types/express.js';
import { CreateReviewDTO } from './dto/create.js';
import { Roles } from '../../common/decorators/role.decorator.js';
import { UserRole } from '../../common/enums/user.enum.js';

@ApiTags('Reviews')
@Controller('api/reviews')
@UseInterceptors(ResponseInterceptor)
@UseGuards(AuthGuard, UserActiveGuard, RolesGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiOperation({
    summary: 'Create a review',
    description: 'Create a review for a completed contract.',
  })
  @ApiResponse({
    status: 201,
    description: 'Review created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Contract is not completed or has already been reviewed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Contract not found.',
  })
  @Post(':contractId')
  @Roles(UserRole.CLIENT)
  create(
    @Req() req: RequestWithUser,
    @Param('contractId') contractId: string,
    @Body() data: CreateReviewDTO,
  ) {
    return this.reviewService.create(req.user.id, contractId, data);
  }

  @ApiOperation({
    summary: 'Get my reviews',
    description:
      'Returns paginated reviews for all services belonging to the authenticated freelancer.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Number of reviews per page',
  })
  @ApiResponse({
    status: 200,
    description: 'Reviews fetched successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @Get('me')
  findMe(
    @Req() req: RequestWithUser,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.reviewService.findMe(
      req.user.id,
      Number(page) || 1,
      Number(limit) || 10,
    );
  }

  @ApiOperation({
    summary: 'Get freelancer reviews',
    description:
      'Returns paginated reviews for all services belonging to the specified freelancer.',
  })
  @ApiParam({
    name: 'freelancerId',
    type: String,
    description: 'Freelancer ID',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Number of reviews per page',
  })
  @ApiResponse({
    status: 200,
    description: 'Freelancer reviews fetched successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Freelancer not found.',
  })
  @Get('freelancer/:freelancerId')
  async findByFreelancer(
    @Param('freelancerId') freelancerId: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.reviewService.findByFreelancer(
      freelancerId,
      Number(page) || 1,
      Number(limit) || 10,
    );
  }

  @ApiOperation({
    summary: 'Get all reviews for a service',
    description: 'Returns paginated reviews for the specified service.',
  })
  @ApiParam({
    name: 'serviceId',
    description: 'Service ID',
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Number of reviews per page',
  })
  @ApiResponse({
    status: 200,
    description: 'Reviews fetched successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found.',
  })
  @Get('all/:serviceId')
  findAllByService(
    @Param('serviceId') serviceId: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.reviewService.findAllByService(
      serviceId,
      Number(page) || 1,
      Number(limit) || 10,
    );
  }

  @ApiOperation({
    summary: 'Get a review by ID',
    description: 'Returns a single review by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Review ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Review fetched successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Review not found.',
  })
  @Get(':id')
  findOne(@Param('id') reviewId: string) {
    return this.reviewService.findOne(reviewId);
  }
}

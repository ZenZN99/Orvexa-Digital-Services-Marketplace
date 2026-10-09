import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseInterceptor } from '../../../common/interceptors/response.interceptor.js';
import { AuthGuard } from '../../../common/guards/auth.guard.js';
import { UserActiveGuard } from '../../../common/guards/user-active.guard.js';
import { RolesGuard } from '../../../common/guards/roles.guard.js';
import { FreelancerService } from './freelancer.service.js';
import type { RequestWithUser } from '../../../types/express.js';
import { Roles } from '../../../common/decorators/role.decorator.js';
import { UserRole } from '../../../common/enums/user.enum.js';
import { UpdateFreelancerDTO } from './dto/update.js';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Freelancers')
@Controller('api/freelancers')
@UseInterceptors(ResponseInterceptor)
@UseGuards(AuthGuard, UserActiveGuard, RolesGuard)
export class FreelancerController {
  constructor(private readonly freelancerService: FreelancerService) {}

  @ApiOperation({
    summary: 'Get my freelancer profile',
    description:
      'Returns the freelancer profile associated with the currently authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Freelancer profile retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required.',
  })
  @ApiResponse({
    status: 403,
    description: 'The user account is not active.',
  })
  @ApiResponse({
    status: 404,
    description: 'Freelancer profile not found.',
  })
  @Get()
  findMe(@Req() req: RequestWithUser) {
    return this.freelancerService.findMe(req.user.id);
  }

  @ApiOperation({
    summary: 'Get a freelancer profile',
    description: 'Returns a freelancer profile using the associated user ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID associated with the freelancer profile.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Freelancer profile retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required.',
  })
  @ApiResponse({
    status: 403,
    description: 'The user account is not active.',
  })
  @ApiResponse({
    status: 404,
    description: 'Freelancer profile not found.',
  })
  @Get(':id')
  findOne(@Param('id') userId: string) {
    return this.freelancerService.findOne(userId);
  }

  @ApiOperation({
    summary: 'Update my freelancer profile',
    description:
      'Updates the freelancer profile of the currently authenticated freelancer.',
  })
  @ApiBody({
    type: UpdateFreelancerDTO,
  })
  @ApiResponse({
    status: 200,
    description: 'Freelancer profile updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid freelancer profile data.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required.',
  })
  @ApiResponse({
    status: 403,
    description: 'The account must have the freelancer role and be active.',
  })
  @ApiResponse({
    status: 404,
    description: 'Freelancer profile not found.',
  })
  @Put()
  @Roles(UserRole.FREELANCER)
  update(@Req() req: RequestWithUser, @Body() data: UpdateFreelancerDTO) {
    return this.freelancerService.update(req.user.id, data);
  }
}

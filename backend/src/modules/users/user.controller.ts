import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ResponseInterceptor } from '../../common/interceptors/response.interceptor.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { UserActiveGuard } from '../../common/guards/user-active.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { UserService } from './user.service.js';
import { UserRole } from '../../common/enums/user.enum.js';
import { Roles } from '../../common/decorators/role.decorator.js';
import type { RequestWithUser } from '../../types/express.js';

@ApiTags('Users')
@Controller('api/users')
@UseInterceptors(ResponseInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Get all users',
    description: 'Returns a paginated list of users ordered by creation date.',
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
    description: 'Number of users per page.',
  })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required.',
  })
  @ApiResponse({
    status: 403,
    description: 'The user account is not authorized to access this resource.',
  })
  @Get()
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    return this.userService.findAll(Number(page) || 1, Number(limit) || 10);
  }

  @ApiOperation({
    summary: 'Get a user by ID',
    description: 'Returns a user by their unique identifier.',
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required.',
  })
  @ApiResponse({
    status: 403,
    description: 'The user account is not authorized to access this resource.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @Get(':id')
  findOne(@Param('id') userId: string) {
    return this.userService.findOne(userId);
  }

  @ApiOperation({
    summary: 'Update a user role (admin only)',
    description:
      'Updates the role of a user. This operation is restricted to administrators.',
  })
  @ApiResponse({
    status: 200,
    description: 'User role updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid user role.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Administrator privileges are required.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @Patch(':id')
  @UseGuards(AuthGuard, UserActiveGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateRole(@Param('id') userId: string, @Body('role') role: UserRole) {
    return this.userService.udpateRole(userId, role);
  }

  @ApiOperation({
    summary: 'Block a user (admin only)',
    description:
      'Deactivates a user account. This operation is restricted to administrators.',
  })
  @ApiResponse({
    status: 200,
    description: 'User blocked successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Administrator privileges are required.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @Delete(':id')
  @UseGuards(AuthGuard, UserActiveGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  block(@Req() req: RequestWithUser, @Param('id') userId: string) {
    return this.userService.block(req.user.id, userId);
  }
}

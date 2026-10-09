import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service.js';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { UserActiveGuard } from '../../common/guards/user-active.guard.js';
import type { RequestWithUser } from '../../types/express.js';

@ApiTags('Notifications')
@Controller('api/notifications')
@UseInterceptors(ResponseInterceptor)
@UseGuards(AuthGuard, UserActiveGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({
    summary: 'Get my notifications',
    description:
      'Retrieves all notifications belonging to the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Notifications retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @Get('me')
  findMe(@Req() req: RequestWithUser) {
    return this.notificationService.findMe(req.user.id);
  }

  @Patch(':id/read')
  @ApiOperation({
    summary: 'Mark notification as read',
    description:
      'Marks a specific notification as read. The notification must belong to the authenticated user.',
  })
  @ApiParam({
    name: 'id',
    description: 'Notification ID.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Notification marked as read successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 404,
    description: 'Notification not found.',
  })
  markAsRead(@Req() req: RequestWithUser, @Param('id') notificationId: string) {
    return this.notificationService.markAsRead(req.user.id, notificationId);
  }

  @Put('read-all')
  @ApiOperation({
    summary: 'Mark all notifications as read',
    description:
      'Marks all unread notifications belonging to the authenticated user as read.',
  })
  @ApiResponse({
    status: 200,
    description: 'All notifications marked as read successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  markAllAsRead(@Req() req: RequestWithUser) {
    return this.notificationService.markAllAsRead(req.user.id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a notification',
    description:
      'Deletes a notification belonging to the authenticated user. Users cannot delete notifications belonging to other users.',
  })
  @ApiParam({
    name: 'id',
    description: 'Notification ID.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Notification deleted successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 404,
    description: 'Notification not found.',
  })
  destroy(@Req() req: RequestWithUser, @Param('id') notificationId: string) {
    return this.notificationService.destroy(req.user.id, notificationId);
  }
}

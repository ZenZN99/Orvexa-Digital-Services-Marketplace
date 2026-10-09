import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SupportMessageService } from './support-message.service.js';
import { ResponseInterceptor } from '../../../common/interceptors/response.interceptor.js';
import { AuthGuard } from '../../../common/guards/auth.guard.js';
import { UserActiveGuard } from '../../../common/guards/user-active.guard.js';
import { RolesGuard } from '../../../common/guards/roles.guard.js';
import type { RequestWithUser } from '../../../types/express.js';
import { Roles } from '../../../common/decorators/role.decorator.js';
import { UserRole } from '../../../common/enums/user.enum.js';

@ApiTags('Support Messages')
@Controller('api/support-messages')
@UseInterceptors(ResponseInterceptor)
@UseGuards(AuthGuard, UserActiveGuard, RolesGuard)
export class SupportMessageController {
  constructor(private readonly supportMessageService: SupportMessageService) {}

  @ApiOperation({
    summary: 'Send a support message',
    description:
      'Sends a message to a support conversation. Clients and freelancers can send messages to their own conversations, while support staff and administrators can reply to any support conversation.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'conversationId',
    description: 'Support conversation ID.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          nullable: true,
          example: 'Hello, I need help with my order.',
          description: 'Optional message content.',
        },
        attachments: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          maxItems: 5,
          description: 'Optional attachments. Maximum 5 files.',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Support message sent successfully.',
  })
  @ApiResponse({
    status: 400,
    description:
      'The support conversation is closed or the message contains neither text nor attachments.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 404,
    description: 'Support conversation not found.',
  })
  @Post(':conversationId')
  @UseInterceptors(FilesInterceptor('attachments', 5))
  create(
    @Req() req: RequestWithUser,
    @Param('conversationId') conversationId: string,
    @Body('message') message: string | null,
    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    return this.supportMessageService.create(
      req.user,
      conversationId,
      message,
      files,
    );
  }

  @ApiOperation({
    summary: 'Get support messages',
    description:
      'Retrieves all messages from a support conversation. Clients and freelancers can access their own conversations, while support staff and administrators can access any support conversation.',
  })
  @ApiParam({
    name: 'conversationId',
    description: 'Support conversation ID.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Support messages retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 404,
    description: 'Support conversation not found.',
  })
  @Get(':conversationId')
  findAll(
    @Req() req: RequestWithUser,
    @Param('conversationId') conversationId: string,
  ) {
    return this.supportMessageService.findAll(req.user, conversationId);
  }

  @ApiOperation({
    summary: 'Mark all support messages as read',
    description:
      'Marks all unread messages in a support conversation as read. Clients and freelancers can mark messages in their own conversations, while support staff and administrators can mark messages in any support conversation.',
  })
  @ApiParam({
    name: 'conversationId',
    description: 'Support conversation ID.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Support messages marked as read successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 404,
    description: 'Support conversation not found.',
  })
  @Patch(':conversationId')
  markAllAsRead(
    @Req() req: RequestWithUser,
    @Param('conversationId') conversationId: string,
  ) {
    return this.supportMessageService.markAllAsRead(req.user, conversationId);
  }

  @ApiOperation({
    summary: 'Delete a support message',
    description:
      'Deletes a support message and its attachments. Only administrators and support staff can delete support messages.',
  })
  @ApiParam({
    name: 'conversationId',
    description: 'Support conversation ID.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiParam({
    name: 'messageId',
    description: 'Support message ID.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Support message deleted successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Only administrators and support staff can delete support messages.',
  })
  @ApiResponse({
    status: 404,
    description: 'Support message or support conversation not found.',
  })
  @Delete(':conversationId/:messageId')
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  destroy(
    @Param('conversationId') conversationId: string,
    @Param('messageId') messageId: string,
  ) {
    return this.supportMessageService.destroy(conversationId, messageId);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
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
import type { RequestWithUser } from '../../types/express.js';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MessageService } from './message.service.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/role.decorator.js';
import { UserRole } from '../../common/enums/user.enum.js';

@ApiTags('Messages')
@Controller('api/messages')
@UseInterceptors(ResponseInterceptor)
@UseGuards(AuthGuard, UserActiveGuard, RolesGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiOperation({
    summary: 'Send a message',
    description:
      'Sends a message to the other participant of the contract with optional images.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'contractId',
    description: 'Contract ID.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          example: 'Here is the updated design. Please check it.',
          maxLength: 5000,
        },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          maxItems: 5,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Message must contain text or at least one image, or the contract is closed.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 404,
    description: 'Contract not found.',
  })
  @Post(':contractId')
  @UseInterceptors(FilesInterceptor('images', 5))
  create(
    @Req() req: RequestWithUser,
    @Param('contractId') contractId: string,
    @Body('content') content: string,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.messageService.create(req.user.id, contractId, content, images);
  }

  @ApiOperation({
    summary: 'Get all messages',
    description:
      'Retrieves all messages for administrative monitoring with pagination.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Page number.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Number of messages per page.',
  })
  @ApiResponse({
    status: 200,
    description: 'Messages retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @Get()
  @Roles(UserRole.ADMIN)
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    return this.messageService.findAll(Number(page) || 1, Number(limit) || 10);
  }

  @ApiOperation({
    summary: 'Get contract messages',
    description:
      'Retrieves all messages for a contract between the authenticated client and freelancer.',
  })
  @ApiParam({
    name: 'contractId',
    description: 'Contract ID.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Messages retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 404,
    description: 'Contract not found.',
  })
  @Get(':contractId')
  findMe(@Req() req: RequestWithUser, @Param('contractId') contractId: string) {
    return this.messageService.findMe(req.user.id, contractId);
  }

  @ApiOperation({
    summary: 'Delete a message',
    description:
      'Deletes a message. The sender can delete their own message while the contract is in progress. Admins can delete any message regardless of the contract status.',
  })
  @ApiParam({
    name: 'id',
    description: 'Message ID.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Message deleted successfully.',
  })
  @ApiResponse({
    status: 400,
    description:
      'The message cannot be deleted because the contract is no longer in progress.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 403,
    description: 'You are not allowed to delete this message.',
  })
  @ApiResponse({
    status: 404,
    description: 'Message not found.',
  })
  @Delete(':id')
  destroy(@Req() req: RequestWithUser, @Param('id') messageId: string) {
    return this.messageService.destroy(req.user, messageId);
  }
}

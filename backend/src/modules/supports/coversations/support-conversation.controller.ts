import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseInterceptor } from '../../../common/interceptors/response.interceptor.js';
import { AuthGuard } from '../../../common/guards/auth.guard.js';
import { UserActiveGuard } from '../../../common/guards/user-active.guard.js';
import { RolesGuard } from '../../../common/guards/roles.guard.js';
import { SupportConversationService } from './support-conversation.service.js';
import type { RequestWithUser } from '../../../types/express.js';
import { Roles } from '../../../common/decorators/role.decorator.js';
import { UserRole } from '../../../common/enums/user.enum.js';

@ApiTags('Support Conversations')
@ApiBearerAuth()
@Controller('api/support-conversations')
@UseInterceptors(ResponseInterceptor)
@UseGuards(AuthGuard, UserActiveGuard, RolesGuard)
export class SupportConversationController {
  constructor(
    private readonly supportConversationService: SupportConversationService,
  ) {}

  @ApiOperation({
    summary: 'Create a support conversation',
    description:
      'Creates a new support conversation for the authenticated client or freelancer. A user can only have one open support conversation at a time.',
  })
  @ApiResponse({
    status: 201,
    description: 'Support conversation created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'The user already has an open support conversation.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Client or freelancer access is required.',
  })
  @Post()
  @Roles(UserRole.CLIENT, UserRole.FREELANCER)
  create(@Req() req: RequestWithUser) {
    return this.supportConversationService.create(req.user.id);
  }

  @ApiOperation({
    summary: 'Get all support conversations',
    description:
      'Retrieves all support conversations with pagination. Available to administrators and support staff.',
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
    description: 'Number of conversations per page.',
  })
  @ApiResponse({
    status: 200,
    description: 'Support conversations retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Admin or support access is required.',
  })
  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    return this.supportConversationService.findAll(
      Number(page) || 1,
      Number(limit) || 10,
    );
  }

  @ApiOperation({
    summary: 'Get my open support conversation',
    description:
      'Retrieves the authenticated user’s current open support conversation.',
  })
  @ApiResponse({
    status: 200,
    description: 'Support conversation retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 404,
    description: 'Open support conversation not found.',
  })
  @Get('me')
  findMe(@Req() req: RequestWithUser) {
    return this.supportConversationService.findMe(req.user.id);
  }

  @ApiOperation({
    summary: 'Get a support conversation',
    description:
      'Retrieves a specific support conversation belonging to the authenticated user.',
  })
  @ApiParam({
    name: 'id',
    description: 'Support conversation ID.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Support conversation retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 404,
    description: 'Support conversation not found.',
  })
  @Get(':id')
  findOne(@Req() req: RequestWithUser, @Param('id') conversationId: string) {
    return this.supportConversationService.findOne(req.user.id, conversationId);
  }

  @ApiOperation({
    summary: 'Toggle a support conversation',
    description:
      'Toggles a support conversation between open and closed. This endpoint is available to administrators only.',
  })
  @ApiParam({
    name: 'id',
    description: 'Support conversation ID.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Support conversation status toggled successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Admin access is required.',
  })
  @ApiResponse({
    status: 404,
    description: 'Support conversation not found.',
  })
  @Put(':id')
  @Roles(UserRole.ADMIN)
  toggle(@Req() req: RequestWithUser, @Param('id') conversationId: string) {
    return this.supportConversationService.toggle(req.user.id, conversationId);
  }
}

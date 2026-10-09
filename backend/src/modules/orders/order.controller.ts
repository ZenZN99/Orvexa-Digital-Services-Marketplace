import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { UserActiveGuard } from '../../common/guards/user-active.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { OrderService } from './order.service.js';
import type { RequestWithUser } from '../../types/express.js';
import { Roles } from '../../common/decorators/role.decorator.js';
import { UserRole } from '../../common/enums/user.enum.js';

@ApiTags('Orders')
@Controller('api/orders')
@UseInterceptors(ResponseInterceptor)
@UseGuards(AuthGuard, UserActiveGuard, RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({
    summary: 'Create a new order',
    description: 'Creates an order from the authenticated user cart.',
  })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Cart is empty.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @Post()
  @Roles(UserRole.CLIENT)
  create(@Req() req: RequestWithUser) {
    return this.orderService.create(req.user.id);
  }

  @ApiOperation({
    summary: 'Get all orders',
    description: 'Returns all orders for admin management.',
  })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Admin access required.',
  })
  @Get()
  @Roles(UserRole.ADMIN)
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    return this.orderService.findAll(Number(page) || 1, Number(limit) || 10);
  }

  @ApiOperation({
    summary: 'Get my orders',
    description: 'Returns all orders belonging to the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @Get('me')
  @Roles(UserRole.CLIENT)
  findMe(@Req() req: RequestWithUser) {
    return this.orderService.findMe(req.user.id);
  }

  @ApiOperation({
    summary: 'Get order details',
    description:
      'Returns details of a specific order belonging to the authenticated user.',
  })
  @ApiParam({
    name: 'orderId',
    description: 'Order ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Order retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found.',
  })
  @Get(':id')
  findOne(@Req() req: RequestWithUser, @Param('id') orderId: string) {
    return this.orderService.findOne(req.user.id, orderId);
  }

  @ApiOperation({
    summary: 'Delete an order',
    description:
      'Deletes an order belonging to the authenticated user. Only orders with PENDING_PAYMENT status can be deleted.',
  })
  @ApiParam({
    name: 'orderId',
    description: 'Order ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Order deleted successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Only orders with PENDING_PAYMENT status can be deleted.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found.',
  })
  @Delete(':id')
  @Roles(UserRole.CLIENT)
  destroy(@Req() req: RequestWithUser, @Param('id') orderId: string) {
    return this.orderService.destroy(req.user.id, orderId);
  }
}

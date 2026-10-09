import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { UserActiveGuard } from '../../common/guards/user-active.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { CartService } from './cart.service.js';
import type { RequestWithUser } from '../../types/express.js';
import { Roles } from '../../common/decorators/role.decorator.js';
import { UserRole } from '../../common/enums/user.enum.js';

@ApiTags('Carts')
@Controller('api/carts')
@UseInterceptors(ResponseInterceptor)
@UseGuards(AuthGuard, UserActiveGuard, RolesGuard)
@Roles(UserRole.CLIENT)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({
    summary: 'Get current user cart',
    description: 'Returns the authenticated client cart and its items.',
  })
  @ApiResponse({
    status: 200,
    description: 'Cart retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only clients can access this endpoint.',
  })
  @Get('me')
  findMe(@Req() req: RequestWithUser) {
    return this.cartService.findMe(req.user.id);
  }

  @ApiOperation({
    summary: 'Add a service to cart',
    description: 'Adds a published service to the authenticated client cart.',
  })
  @ApiParam({
    name: 'serviceId',
    description: 'Service UUID.',
    type: String,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 201,
    description: 'Service added to cart successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Service is already in the cart or belongs to the client.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only clients can add services to cart.',
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found or is not published.',
  })
  @Post(':serviceId')
  addItem(@Req() req: RequestWithUser, @Param('serviceId') serviceId: string) {
    return this.cartService.addItem(req.user.id, serviceId);
  }

  @ApiOperation({
    summary: 'Remove a service from cart',
    description: 'Removes a service from the authenticated client cart.',
  })
  @ApiParam({
    name: 'serviceId',
    description: 'Service UUID.',
    type: String,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Service removed from cart successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only clients can remove services from cart.',
  })
  @ApiResponse({
    status: 404,
    description: 'Cart or cart item not found.',
  })
  @Delete(':serviceId')
  removeItem(
    @Req() req: RequestWithUser,
    @Param('serviceId') serviceId: string,
  ) {
    return this.cartService.removeItem(req.user.id, serviceId);
  }

  @ApiOperation({
    summary: 'Clear cart',
    description: 'Removes all services from the authenticated client cart.',
  })
  @ApiResponse({
    status: 200,
    description: 'Cart cleared successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only clients can clear their cart.',
  })
  @ApiResponse({
    status: 404,
    description: 'Cart not found.',
  })
  @Delete()
  clearCart(@Req() req: RequestWithUser) {
    return this.cartService.clearCart(req.user.id);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
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
import { PaymentService } from './payment.service.js';
import type { RequestWithUser } from '../../types/express.js';
import { Roles } from '../../common/decorators/role.decorator.js';
import { UserRole } from '../../common/enums/user.enum.js';
import { UserVerificationGuard } from '../../common/guards/user-verification.guard.js';

@ApiTags('Payments')
@Controller('api/payments')
@UseInterceptors(ResponseInterceptor)
@UseGuards(AuthGuard, UserActiveGuard, RolesGuard, UserVerificationGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({
    summary: 'Pay for an order',
    description:
      'Completes the payment for a pending order using the authenticated client balance.',
  })
  @ApiParam({
    name: 'orderId',
    description: 'Order ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 201,
    description: 'Payment completed successfully.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Order has already been processed, insufficient balance, or order payment failed.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Client access required.',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found.',
  })
  @Post(':orderId')
  @Roles(UserRole.CLIENT)
  pay(@Req() req: RequestWithUser, @Param('orderId') orderId: string) {
    return this.paymentService.pay(req.user.id, orderId);
  }

  @ApiOperation({
    summary: 'Get all payments',
    description: 'Returns all payments for admin management with pagination.',
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
    description: 'Number of payments per page.',
  })
  @ApiResponse({
    status: 200,
    description: 'All payments retrieved successfully.',
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
    return this.paymentService.findAll(Number(page) || 1, Number(limit) || 10);
  }

  @ApiOperation({
    summary: 'Get my payments',
    description: 'Returns all payments made by the authenticated client.',
  })
  @ApiResponse({
    status: 200,
    description: 'Payments retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Client access required.',
  })
  @Get('me')
  @Roles(UserRole.CLIENT)
  findMe(@Req() req: RequestWithUser) {
    return this.paymentService.findMe(req.user.id);
  }

  @ApiOperation({
    summary: 'Get payment details',
    description:
      'Returns details of a specific payment belonging to the authenticated client.',
  })
  @ApiParam({
    name: 'id',
    description: 'Payment ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Client access required.',
  })
  @ApiResponse({
    status: 404,
    description: 'Payment not found.',
  })
  @Get(':id')
  @Roles(UserRole.CLIENT)
  findOne(@Req() req: RequestWithUser, @Param('id') paymentId: string) {
    return this.paymentService.findOne(req.user.id, paymentId);
  }

  @ApiOperation({
    summary: 'Recharge balance',
    description:
      "Adds the specified amount to the authenticated client's balance.",
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: {
          type: 'number',
          example: 100,
          description: "Amount to add to the client's balance.",
          minimum: 0.01,
        },
      },
      required: ['amount'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Balance recharged successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid recharge amount.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Client access required.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @Patch('recharge-balance')
  @Roles(UserRole.CLIENT)
  rechargeBalance(@Req() req: RequestWithUser, @Body('amount') amount: number) {
    return this.paymentService.rechargeBalance(req.user.id, amount);
  }
}

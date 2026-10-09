import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { UserActiveGuard } from '../../common/guards/user-active.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/role.decorator.js';
import { UserRole } from '../../common/enums/user.enum.js';
import { PlatformWalletService } from './platform-wallet.service.js';
import type { RequestWithUser } from '../../types/express.js';
import { UserVerificationGuard } from '../../common/guards/user-verification.guard.js';

@ApiTags('Platform Wallet')
@ApiBearerAuth()
@Controller('api/platform-wallets')
@UseInterceptors(ResponseInterceptor)
@UseGuards(AuthGuard, UserActiveGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class PlatformWalletController {
  constructor(private readonly platformWalletService: PlatformWalletService) {}

  @ApiOperation({
    summary: 'Get platform wallet balance',
    description:
      'Retrieves the current balance of the platform wallet. This endpoint is available to administrators only.',
  })
  @ApiResponse({
    status: 200,
    description: 'Platform wallet balance retrieved successfully.',
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
    description: 'Platform wallet not found.',
  })
  @Get()
  findBalance() {
    return this.platformWalletService.findBalance();
  }

  @ApiOperation({
    summary: 'Withdraw from platform wallet',
    description:
      'Withdraws money from the platform wallet and transfers it to the authenticated administrator account.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['amount'],
      properties: {
        amount: {
          type: 'number',
          example: 100,
          minimum: 0.01,
          description: 'Amount to withdraw from the platform wallet.',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Platform balance withdrawn successfully.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Insufficient platform wallet balance or invalid withdrawal amount.',
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
    description: 'Platform wallet not found or admin user not found.',
  })
  @Post()
  @UseGuards(UserVerificationGuard)
  withdraw(@Req() req: RequestWithUser, @Body('amount') amount: number) {
    return this.platformWalletService.withdraw(req.user.id, amount);
  }
}

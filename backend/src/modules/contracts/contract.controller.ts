import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
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
import { ContractService } from './contract.service.js';
import type { RequestWithUser } from '../../types/express.js';
import { Roles } from '../../common/decorators/role.decorator.js';
import { UserRole } from '../../common/enums/user.enum.js';
import { UserVerificationGuard } from '../../common/guards/user-verification.guard.js';

@ApiTags('Contracts')
@Controller('api/contracts')
@UseInterceptors(ResponseInterceptor)
@UseGuards(AuthGuard, UserActiveGuard, RolesGuard)
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @ApiOperation({
    summary: 'Get my contracts',
    description:
      'Retrieves all contracts associated with the authenticated user as a client or freelancer.',
  })
  @ApiResponse({
    status: 200,
    description: 'Contracts retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @Get('me')
  findMe(@Req() req: RequestWithUser) {
    return this.contractService.findMe(req.user.id);
  }

  @ApiOperation({
    summary: 'Get all contracts',
    description:
      'Retrieves all contracts with pagination. Admin access is required.',
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
    description: 'Number of contracts per page.',
  })
  @ApiResponse({
    status: 200,
    description: 'All contracts retrieved successfully.',
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
    return this.contractService.findAll(Number(page) || 1, Number(limit) || 10);
  }

  @ApiOperation({
    summary: 'Get a contract',
    description:
      'Retrieves a contract by ID for the authenticated client or freelancer.',
  })
  @ApiParam({
    name: 'id',
    description: 'Contract ID.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Contract retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 404,
    description: 'Contract not found.',
  })
  @Get(':id')
  findOne(@Req() req: RequestWithUser, @Param('id') contractId: string) {
    return this.contractService.findOne(req.user.id, contractId);
  }

  @ApiOperation({
    summary: 'Complete a contract',
    description:
      'Completes a delivered contract and releases the payment to the freelancer. Client access is required.',
  })
  @ApiParam({
    name: 'id',
    description: 'Contract ID.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 201,
    description: 'Service completed successfully.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Contract is not delivered or there is insufficient frozen balance.',
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
    description: 'Contract not found.',
  })
  @Post('complete/:id')
  @UseGuards(UserVerificationGuard)
  @Roles(UserRole.CLIENT)
  complete(@Req() req: RequestWithUser, @Param('id') contractId: string) {
    return this.contractService.complete(req.user.id, contractId);
  }

  @ApiOperation({
    summary: 'Deliver a contract',
    description: 'Marks a contract as delivered by the assigned freelancer.',
  })
  @ApiParam({
    name: 'id',
    description: 'Contract ID.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 201,
    description: 'Contract delivered successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Only contracts in progress can be marked as delivered.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 404,
    description: 'Contract not found.',
  })
  @Post('deliver/:id')
  deliver(@Req() req: RequestWithUser, @Param('id') contractId: string) {
    return this.contractService.deliver(req.user.id, contractId);
  }
}

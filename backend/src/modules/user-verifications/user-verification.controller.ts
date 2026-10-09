import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UserVerificationService } from './user-verification.service.js';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { UserActiveGuard } from '../../common/guards/user-active.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/role.decorator.js';
import { UserRole } from '../../common/enums/user.enum.js';
import { UpdateUserVerificationDTO } from './dto/update.js';
import type { RequestWithUser } from '../../types/express.js';

@ApiTags('User Verification')
@ApiBearerAuth()
@Controller('api/user-verifications')
@UseInterceptors(ResponseInterceptor)
@UseGuards(AuthGuard, UserActiveGuard, RolesGuard)
export class UserVerificationController {
  constructor(
    private readonly userVerificationService: UserVerificationService,
  ) {}

  @ApiOperation({
    summary: 'Submit identity verification',
    description:
      'Submits an identity verification request with a profile image and an identity document.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          minItems: 2,
          maxItems: 2,
          description:
            'Two images are required: profile image and identity document.',
        },
      },
      required: ['images'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Verification request submitted successfully.',
  })
  @ApiResponse({
    status: 400,
    description:
      'The user already has a pending or approved verification request.',
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
  @UseInterceptors(FilesInterceptor('images', 2))
  create(
    @Req() req: RequestWithUser,
    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    return this.userVerificationService.create(req.user.id, files[0], files[1]);
  }

  @ApiOperation({
    summary: 'Get pending verification requests',
    description:
      'Returns a paginated list of pending identity verification requests ordered by submission date.',
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
    description: 'Number of verification requests per page.',
  })
  @ApiResponse({
    status: 200,
    description: 'Pending verification requests retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Admin access is required.',
  })
  @Get('pending')
  @Roles(UserRole.ADMIN)
  findPending(@Query('page') page: string, @Query('limit') limit: string) {
    return this.userVerificationService.findPending(
      Number(page) || 1,
      Number(limit) || 10,
    );
  }

  @ApiOperation({
    summary: 'Retry identity verification',
    description:
      'Resets the current identity verification request and allows the user to submit a new verification request.',
  })
  @ApiResponse({
    status: 200,
    description: 'Identity verification reset successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'The user cannot retry identity verification at this time.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 404,
    description: 'User verification not found.',
  })
  @Post('try-again')
  tryAgain(@Req() req: RequestWithUser) {
    return this.userVerificationService.tryAgain(req.user.id);
  }

  @ApiOperation({
    summary: 'Update verification status',
    description: 'Approves or rejects a pending identity verification request.',
  })
  @ApiParam({
    name: 'id',
    description: 'User verification ID.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    type: UpdateUserVerificationDTO,
  })
  @ApiResponse({
    status: 200,
    description: 'User verification status updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description:
      'The verification has already been reviewed or a rejection reason is required.',
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
    description: 'User verification not found.',
  })
  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  updateStatus(
    @Req() req: RequestWithUser,
    @Param('id') verificationId: string,
    @Body() data: UpdateUserVerificationDTO,
  ) {
    return this.userVerificationService.updateStatus(
      req.user.id,
      verificationId,
      data,
    );
  }
}

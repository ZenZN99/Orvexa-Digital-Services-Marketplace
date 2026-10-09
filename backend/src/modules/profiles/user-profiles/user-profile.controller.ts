import {
  Body,
  Controller,
  Put,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserProfileService } from './user-profile.service.js';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UpdateUserProfileDTO } from './dto/update.js';
import { ResponseInterceptor } from '../../../common/interceptors/response.interceptor.js';
import { UserActiveGuard } from '../../../common/guards/user-active.guard.js';
import { AuthGuard } from '../../../common/guards/auth.guard.js';
import type { RequestWithUser } from '../../../types/express.js';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('User Profiles')
@Controller('api/user-profiles')
@UseInterceptors(ResponseInterceptor)
@UseGuards(AuthGuard, UserActiveGuard)
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @ApiOperation({
    summary: 'Update the current user profile',
    description:
      'Updates the authenticated user profile and optionally uploads a new avatar or cover image.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'User profile data and optional profile images.',
    schema: {
      type: 'object',
      properties: {
        bio: {
          type: 'string',
          example: 'Software Engineer and Full-Stack Engineer.',
        },
        avatar: {
          type: 'string',
          format: 'binary',
        },
        cover: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid profile data or uploaded file.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required.',
  })
  @ApiResponse({
    status: 403,
    description: 'The user account is not active.',
  })
  @ApiResponse({
    status: 404,
    description: 'User profile not found.',
  })
  @Put()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'cover', maxCount: 1 },
    ]),
  )
  update(
    @Req() req: RequestWithUser,
    @Body() data: UpdateUserProfileDTO,
    @UploadedFiles()
    files: { avatar?: Express.Multer.File[]; cover?: Express.Multer.File[] },
  ) {
    return this.userProfileService.update(
      req.user.id,
      data,
      files.avatar?.[0],
      files.cover?.[0],
    );
  }
}

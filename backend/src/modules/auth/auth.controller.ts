import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor.js';
import { AuthPipe } from '../../common/pipes/auth.pipe.js';
import { RegisterDTO } from './dto/register.js';
import { LoginDTO } from './dto/login.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { UserActiveGuard } from '../../common/guards/user-active.guard.js';
import type { Request, Response } from 'express';
import type { RequestWithUser } from '../../types/express.js';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('/api/auth')
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a new user account and automatically authenticates the user by setting access and refresh tokens in HTTP-only cookies.',
  })
  @ApiResponse({
    status: 201,
    description: 'Account created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid registration data.',
  })
  @ApiResponse({
    status: 409,
    description:
      'The account could not be created because the provided information conflicts with an existing account.',
  })
  @Post('register')
  register(
    @Body(AuthPipe) data: RegisterDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.register(data, res);
  }

  @ApiOperation({
    summary: 'Log in a user',
    description:
      'Authenticates a user and sets access and refresh tokens in HTTP-only cookies.',
  })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid login data.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Authentication failed because the credentials are invalid or the account is deactivated.',
  })
  @Post('login')
  login(
    @Body(AuthPipe) data: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(data, res);
  }

  @ApiOperation({
    summary: 'Log out the current user',
    description:
      'Invalidates the stored refresh token and clears authentication cookies.',
  })
  @ApiResponse({
    status: 200,
    description: 'User logged out successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required.',
  })
  @Post('logout')
  @UseGuards(AuthGuard)
  logout(
    @Res({ passthrough: true }) res: Response,
    @Req() req: RequestWithUser,
  ) {
    return this.authService.logout(res, req.user.id);
  }

  @ApiOperation({
    summary: 'Get the current authenticated user',
    description:
      'Returns the profile information of the currently authenticated and active user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Authenticated user retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Authentication failed or the user account could not be found.',
  })
  @ApiResponse({
    status: 403,
    description: 'The user account is not active.',
  })
  @Get('me')
  @UseGuards(AuthGuard, UserActiveGuard)
  me(@Req() req: RequestWithUser) {
    return this.authService.me(req.user.id);
  }

  @ApiOperation({
    summary: 'Refresh the access token',
    description:
      'Generates a new access token using the refresh token stored in the HTTP-only cookie.',
  })
  @ApiResponse({
    status: 200,
    description: 'Access token refreshed successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token is missing, invalid, or expired.',
  })
  @Post('refreshToken')
  refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.refreshToken(req, res);
  }
}

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Get, Post, Req, Res, UseGuards, UseInterceptors, } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor.js';
import { AuthPipe } from '../../common/pipes/auth.pipe.js';
import { RegisterDTO } from './dto/register.js';
import { LoginDTO } from './dto/login.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { UserActiveGuard } from '../../common/guards/user-active.guard.js';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    register(data, res) {
        return this.authService.register(data, res);
    }
    login(data, res) {
        return this.authService.login(data, res);
    }
    logout(res, req) {
        return this.authService.logout(res, req.user.id);
    }
    me(req) {
        return this.authService.me(req.user.id);
    }
    refreshToken(req, res) {
        return this.authService.refreshToken(req, res);
    }
};
__decorate([
    ApiOperation({
        summary: 'Register a new user',
        description: 'Creates a new user account and automatically authenticates the user by setting access and refresh tokens in HTTP-only cookies.',
    }),
    ApiResponse({
        status: 201,
        description: 'Account created successfully.',
    }),
    ApiResponse({
        status: 400,
        description: 'Invalid registration data.',
    }),
    ApiResponse({
        status: 409,
        description: 'The account could not be created because the provided information conflicts with an existing account.',
    }),
    Post('register'),
    __param(0, Body(AuthPipe)),
    __param(1, Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterDTO, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    ApiOperation({
        summary: 'Log in a user',
        description: 'Authenticates a user and sets access and refresh tokens in HTTP-only cookies.',
    }),
    ApiResponse({
        status: 200,
        description: 'User logged in successfully.',
    }),
    ApiResponse({
        status: 400,
        description: 'Invalid login data.',
    }),
    ApiResponse({
        status: 401,
        description: 'Authentication failed because the credentials are invalid or the account is deactivated.',
    }),
    Post('login'),
    __param(0, Body(AuthPipe)),
    __param(1, Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDTO, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    ApiOperation({
        summary: 'Log out the current user',
        description: 'Invalidates the stored refresh token and clears authentication cookies.',
    }),
    ApiResponse({
        status: 200,
        description: 'User logged out successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'Authentication is required.',
    }),
    Post('logout'),
    UseGuards(AuthGuard),
    __param(0, Res({ passthrough: true })),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    ApiOperation({
        summary: 'Get the current authenticated user',
        description: 'Returns the profile information of the currently authenticated and active user.',
    }),
    ApiResponse({
        status: 200,
        description: 'Authenticated user retrieved successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'Authentication failed or the user account could not be found.',
    }),
    ApiResponse({
        status: 403,
        description: 'The user account is not active.',
    }),
    Get('me'),
    UseGuards(AuthGuard, UserActiveGuard),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "me", null);
__decorate([
    ApiOperation({
        summary: 'Refresh the access token',
        description: 'Generates a new access token using the refresh token stored in the HTTP-only cookie.',
    }),
    ApiResponse({
        status: 200,
        description: 'Access token refreshed successfully.',
    }),
    ApiResponse({
        status: 401,
        description: 'Refresh token is missing, invalid, or expired.',
    }),
    Post('refreshToken'),
    __param(0, Req()),
    __param(1, Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refreshToken", null);
AuthController = __decorate([
    ApiTags('Auth'),
    Controller('/api/auth'),
    UseInterceptors(ResponseInterceptor),
    __metadata("design:paramtypes", [AuthService])
], AuthController);
export { AuthController };
//# sourceMappingURL=auth.controller.js.map
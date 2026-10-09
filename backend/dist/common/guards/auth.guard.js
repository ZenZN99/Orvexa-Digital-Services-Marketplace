var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException, } from '@nestjs/common';
import { TokenService } from '../../infrastructure/token/token.service.js';
let AuthGuard = class AuthGuard {
    tokenService;
    constructor(tokenService) {
        this.tokenService = tokenService;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = request.cookies?.token;
        if (!token) {
            throw new UnauthorizedException('No token is cookies');
        }
        const payload = this.tokenService.verifyAccessToken(token);
        if (!payload) {
            throw new UnauthorizedException('Invalid or expired token');
        }
        request.user = payload;
        return true;
    }
};
AuthGuard = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [TokenService])
], AuthGuard);
export { AuthGuard };
//# sourceMappingURL=auth.guard.js.map
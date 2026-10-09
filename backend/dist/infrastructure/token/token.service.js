var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';
let TokenService = class TokenService {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    generateAccessToken(payload) {
        const secret = this.configService.get('JWT_SECRET');
        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }
        return jwt.sign(payload, secret, {
            expiresIn: '15m',
        });
    }
    generateRefreshToken(payload) {
        const secret = this.configService.get('JWT_REFRESH_SECRET');
        if (!secret) {
            throw new Error('JWT_REFRESH_SECRET is not defined');
        }
        return jwt.sign(payload, secret, {
            expiresIn: '30d',
        });
    }
    verifyAccessToken(token) {
        const secret = this.configService.get('JWT_SECRET');
        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }
        try {
            return jwt.verify(token, secret);
        }
        catch {
            return null;
        }
    }
    verifyRefreshToken(token) {
        const secret = this.configService.get('JWT_REFRESH_SECRET');
        if (!secret) {
            throw new Error('JWT_REFRESH_SECRET is not defined');
        }
        try {
            return jwt.verify(token, secret);
        }
        catch {
            return null;
        }
    }
};
TokenService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], TokenService);
export { TokenService };
//# sourceMappingURL=token.service.js.map
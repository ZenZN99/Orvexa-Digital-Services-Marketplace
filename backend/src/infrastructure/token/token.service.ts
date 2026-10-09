import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';

export interface TokenPayload {
  id: string;
  role?: string;
}

@Injectable()
export class TokenService {
  constructor(private configService: ConfigService) {}

  generateAccessToken(payload: TokenPayload) {
    const secret = this.configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    return jwt.sign(payload, secret, {
      expiresIn: '15m',
    });
  }

  generateRefreshToken(payload: TokenPayload) {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');

    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET is not defined');
    }

    return jwt.sign(payload, secret, {
      expiresIn: '30d',
    });
  }

  verifyAccessToken(token: string) {
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    try {
      return jwt.verify(token, secret) as TokenPayload;
    } catch {
      return null;
    }
  }

  verifyRefreshToken(token: string) {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');

    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET is not defined');
    }

    try {
      return jwt.verify(token, secret) as TokenPayload;
    } catch {
      return null;
    }
  }
}

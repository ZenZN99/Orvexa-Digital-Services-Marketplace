import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../modules/users/schema/user.schema.js';
import { TokenService } from '../../infrastructure/token/token.service.js';

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const token = request.cookies?.token;

    if (!token) {
      throw new UnauthorizedException('No token is cookies');
    }

    const payload = this.tokenService.verifyAccessToken(token);

    if (!payload) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    request.user = payload as User;
    return true;
  }
}

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enums/user.enum.js';
import { ROLES_KEY } from '../decorators/role.decorator.js';
import { messages } from '../libs/messages.js';
import { RequestWithUser } from '../../types/express.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const user = request.user;

    if (!user) {
      throw new ForbiddenException(messages.auth.unauthorized);
    }

    const hasRole = roles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(messages.auth.forbidden);
    }

    return true;
  }
}

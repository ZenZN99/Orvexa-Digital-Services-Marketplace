import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../modules/users/schema/user.schema.js';
import { messages } from '../libs/messages.js';

@Injectable()
export class UserActiveGuard implements CanActivate {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authUser = request.user;

    const user = await this.userModel.findByPk(authUser.id);

    if (!user) {
      throw new ForbiddenException(messages.auth.unauthorized);
    }

    if (!user.isActive) {
      throw new ForbiddenException(messages.user.blocked);
    }

    return true;
  }
}

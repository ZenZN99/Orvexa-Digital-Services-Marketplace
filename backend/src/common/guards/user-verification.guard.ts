import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserVerificationStatus } from '../enums/user-verification.enum.js';
import type { RequestWithUser } from '../../types/express.js';
import { messages } from '../libs/messages.js';
import { UserVerification } from '../../modules/user-verifications/schema/user-verification.schema.js';

@Injectable()
export class UserVerificationGuard implements CanActivate {
  constructor(
    @InjectModel(UserVerification)
    private readonly userVerificationModel: typeof UserVerification,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const userId = request.user.id;

    const verification = await this.userVerificationModel.findOne({
      where: {
        userId,
        status: UserVerificationStatus.APPROVED,
      },
    });

    if (!verification) {
      throw new ForbiddenException(messages.userVerification.required);
    }

    return true;
  }
}

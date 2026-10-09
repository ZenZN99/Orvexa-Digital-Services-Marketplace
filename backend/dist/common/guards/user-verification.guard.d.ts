import { CanActivate, ExecutionContext } from '@nestjs/common';
import { UserVerification } from '../../modules/user-verifications/schema/user-verification.schema.js';
export declare class UserVerificationGuard implements CanActivate {
    private readonly userVerificationModel;
    constructor(userVerificationModel: typeof UserVerification);
    canActivate(context: ExecutionContext): Promise<boolean>;
}

import { CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from '../../modules/users/schema/user.schema.js';
export declare class UserActiveGuard implements CanActivate {
    private readonly userModel;
    constructor(userModel: typeof User);
    canActivate(context: ExecutionContext): Promise<boolean>;
}

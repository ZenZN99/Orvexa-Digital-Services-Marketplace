import { CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from '../../modules/users/schema/user.schema.js';
import { TokenService } from '../../infrastructure/token/token.service.js';
declare global {
    namespace Express {
        interface Request {
            user: User;
        }
    }
}
export declare class AuthGuard implements CanActivate {
    private readonly tokenService;
    constructor(tokenService: TokenService);
    canActivate(context: ExecutionContext): boolean;
}

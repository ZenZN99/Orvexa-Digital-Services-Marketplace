import { User } from '../users/schema/user.schema.js';
import { RegisterDTO } from './dto/register.js';
import { Request, Response } from 'express';
import { TokenService } from '../../infrastructure/token/token.service.js';
import { LoginDTO } from './dto/login.js';
import { UserProfile } from '../profiles/user-profiles/schema/user-profile.schema.js';
import { RedisHelper } from '../../infrastructure/database/redis/redis.helper.js';
import { Freelancer } from '../profiles/freelancer/schema/freelancer.schema.js';
import { UserVerification } from '../user-verifications/schema/user-verification.schema.js';
export declare class AuthService {
    private readonly userModel;
    private readonly userProfileModel;
    private readonly userVerificationModel;
    private readonly freelancerModel;
    private readonly tokenService;
    private readonly redis;
    constructor(userModel: typeof User, userProfileModel: typeof UserProfile, userVerificationModel: typeof UserVerification, freelancerModel: typeof Freelancer, tokenService: TokenService, redis: RedisHelper);
    private getCookieOptions;
    private getRefreshCookieOptions;
    register(data: RegisterDTO, res: Response): Promise<{
        message: string | null;
        data: any;
    }>;
    login(data: LoginDTO, res: Response): Promise<{
        message: string | null;
        data: any;
    }>;
    logout(res: Response, userId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    me(userId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    refreshToken(req: Request, res: Response): Promise<{
        message: string | null;
        data: any;
    }>;
}

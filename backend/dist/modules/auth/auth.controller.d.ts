import { AuthService } from './auth.service.js';
import { RegisterDTO } from './dto/register.js';
import { LoginDTO } from './dto/login.js';
import type { Request, Response } from 'express';
import type { RequestWithUser } from '../../types/express.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(data: RegisterDTO, res: Response): Promise<{
        message: string | null;
        data: any;
    }>;
    login(data: LoginDTO, res: Response): Promise<{
        message: string | null;
        data: any;
    }>;
    logout(res: Response, req: RequestWithUser): Promise<{
        message: string | null;
        data: any;
    }>;
    me(req: RequestWithUser): Promise<{
        message: string | null;
        data: any;
    }>;
    refreshToken(req: Request, res: Response): Promise<{
        message: string | null;
        data: any;
    }>;
}

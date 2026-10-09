import { UserService } from './user.service.js';
import { UserRole } from '../../common/enums/user.enum.js';
import type { RequestWithUser } from '../../types/express.js';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(page: string, limit: string): Promise<{
        message: string | null;
        data: any;
    }>;
    findOne(userId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    updateRole(userId: string, role: UserRole): Promise<{
        message: string | null;
        data: any;
    }>;
    block(req: RequestWithUser, userId: string): Promise<{
        message: string | null;
        data: any;
    }>;
}

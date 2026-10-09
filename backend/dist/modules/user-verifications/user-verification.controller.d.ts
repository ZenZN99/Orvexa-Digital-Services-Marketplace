import { UserVerificationService } from './user-verification.service.js';
import { UpdateUserVerificationDTO } from './dto/update.js';
import type { RequestWithUser } from '../../types/express.js';
export declare class UserVerificationController {
    private readonly userVerificationService;
    constructor(userVerificationService: UserVerificationService);
    create(req: RequestWithUser, files: Express.Multer.File[]): Promise<{
        message: string | null;
        data: any;
    }>;
    findPending(page: string, limit: string): Promise<{
        message: string | null;
        data: any;
    }>;
    tryAgain(req: RequestWithUser): Promise<{
        message: string | null;
        data: any;
    }>;
    updateStatus(req: RequestWithUser, verificationId: string, data: UpdateUserVerificationDTO): Promise<{
        message: string | null;
        data: any;
    }>;
}

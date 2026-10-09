import { UserVerification } from './schema/user-verification.schema.js';
import { CloudinaryService } from '../../infrastructure/cloudinary/cloudinary.service.js';
import { User } from '../users/schema/user.schema.js';
import { UpdateUserVerificationDTO } from './dto/update.js';
import { NotificationService } from '../notifications/notification.service.js';
export declare class UserVerificationService {
    private readonly userVerificationModel;
    private readonly userModel;
    private readonly cloudinaryService;
    private readonly notificationService;
    constructor(userVerificationModel: typeof UserVerification, userModel: typeof User, cloudinaryService: CloudinaryService, notificationService: NotificationService);
    create(userId: string, profileImage: Express.Multer.File, identityDocument: Express.Multer.File): Promise<{
        message: string | null;
        data: any;
    }>;
    findPending(page?: number, limit?: number): Promise<{
        message: string | null;
        data: any;
    }>;
    tryAgain(userId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    updateStatus(adminId: string, verificationId: string, data: UpdateUserVerificationDTO): Promise<{
        message: string | null;
        data: any;
    }>;
    private deleteImages;
}

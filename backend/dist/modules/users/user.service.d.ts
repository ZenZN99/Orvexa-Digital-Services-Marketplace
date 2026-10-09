import { User } from './schema/user.schema.js';
import { UserRole } from '../../common/enums/user.enum.js';
import { NotificationService } from '../notifications/notification.service.js';
import { UserProfile } from '../profiles/user-profiles/schema/user-profile.schema.js';
import { UserVerification } from '../user-verifications/schema/user-verification.schema.js';
export declare class UserService {
    private readonly userModel;
    private readonly userProfileModel;
    private readonly userVerificationModel;
    private readonly notificationService;
    constructor(userModel: typeof User, userProfileModel: typeof UserProfile, userVerificationModel: typeof UserVerification, notificationService: NotificationService);
    findAll(page?: number, limit?: number): Promise<{
        message: string | null;
        data: any;
    }>;
    findOne(userId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    udpateRole(userId: string, role: UserRole): Promise<{
        message: string | null;
        data: any;
    }>;
    block(adminId: string, userId: string): Promise<{
        message: string | null;
        data: any;
    }>;
}

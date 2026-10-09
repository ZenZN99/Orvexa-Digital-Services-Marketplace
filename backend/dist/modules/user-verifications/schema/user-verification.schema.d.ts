import { Model } from 'sequelize-typescript';
import { UserVerificationStatus } from '../../../common/enums/user-verification.enum.js';
import { User } from '../../users/schema/user.schema.js';
export declare class UserVerification extends Model {
    id: string;
    userId: string;
    user: User;
    profileImage: {
        url: string;
        publicId: string;
    } | null;
    identityDocument: {
        url: string;
        publicId: string;
    } | null;
    status: UserVerificationStatus | null;
    rejectionReason: string | null;
    reviewedBy: string | null;
    reviewer: User;
    submittedAt: Date | null;
    reviewedAt: Date | null;
}

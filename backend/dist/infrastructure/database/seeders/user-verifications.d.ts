import { UserVerificationStatus } from '../../../common/enums/user-verification.enum.js';
import { User } from '../../../modules/users/schema/user.schema.js';
export declare const generaetUserVerifications: (createdUsers: User[]) => {
    userId: string;
    profileImage: {
        url: string;
        publicId: string;
    };
    identityDocument: {
        url: string;
        publicId: string;
    };
    status: UserVerificationStatus;
    rejectionReason: string | null;
    reviewedBy: string | null;
    submittedAt: Date;
    reviewedAt: Date | null;
}[];

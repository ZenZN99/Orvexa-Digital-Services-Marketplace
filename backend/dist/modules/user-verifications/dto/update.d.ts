import { UserVerificationStatus } from '../../../common/enums/user-verification.enum.js';
export declare class UpdateUserVerificationDTO {
    status: UserVerificationStatus;
    rejectionReason?: string;
}

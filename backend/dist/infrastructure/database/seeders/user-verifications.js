import { UserVerificationStatus } from '../../../common/enums/user-verification.enum.js';
import { UserRole } from '../../../common/enums/user.enum.js';
const verificationStatuses = [
    UserVerificationStatus.PENDING,
    UserVerificationStatus.APPROVED,
    UserVerificationStatus.REJECTED,
];
export const generaetUserVerifications = (createdUsers) => {
    const admin = createdUsers.find((user) => user.role === UserRole.ADMIN);
    return createdUsers
        .filter((user) => user.role !== UserRole.ADMIN)
        .map((user, index) => {
        const status = verificationStatuses[index % verificationStatuses.length];
        const isPending = status === UserVerificationStatus.PENDING;
        const isRejected = status === UserVerificationStatus.REJECTED;
        return {
            userId: user.id,
            profileImage: {
                url: `https://i.pravatar.cc/600?img=${(index % 70) + 1}`,
                publicId: `seed-profile-${index + 1}`,
            },
            identityDocument: {
                url: `https://example.com/identity-documents/${index + 1}.jpg`,
                publicId: `seed-identity-${index + 1}`,
            },
            status,
            rejectionReason: isRejected
                ? 'The submitted identity document could not be verified.'
                : null,
            reviewedBy: isPending ? null : (admin?.id ?? null),
            submittedAt: new Date(),
            reviewedAt: isPending ? null : new Date(),
        };
    });
};
//# sourceMappingURL=user-verifications.js.map
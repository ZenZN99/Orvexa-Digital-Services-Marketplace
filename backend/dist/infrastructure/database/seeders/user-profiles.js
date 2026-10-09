import { UserRole } from "../../../common/enums/user.enum.js";
export const generateUserProfiles = (createdUsers) => {
    return createdUsers.map((user, index) => ({
        userId: user.id,
        avatar: {
            url: `https://i.pravatar.cc/600?img=${(index % 70) + 1}`,
            publicId: `seed-avatar-${index + 1}`,
        },
        cover: {
            url: `https://picsum.photos/seed/orvexa-${index + 1}/1600/500`,
            publicId: `seed-cover-${index + 1}`,
        },
        bio: user.role === UserRole.ADMIN
            ? 'Orvexa platform administrator.'
            : user.role === UserRole.FREELANCER
                ? 'Professional freelancer offering high-quality services on Orvexa.'
                : 'Client looking for talented professionals on Orvexa.',
    }));
};
//# sourceMappingURL=user-profiles.js.map
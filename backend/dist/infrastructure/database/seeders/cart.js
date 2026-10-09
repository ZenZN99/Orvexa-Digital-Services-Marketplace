import { UserRole } from '../../../common/enums/user.enum.js';
export const generateCarts = (createdUsers) => {
    return createdUsers
        .filter((user) => user.role !== UserRole.ADMIN)
        .map((user) => ({
        userId: user.id,
    }));
};
//# sourceMappingURL=cart.js.map
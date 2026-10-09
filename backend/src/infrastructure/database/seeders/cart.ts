import { UserRole } from '../../../common/enums/user.enum.js';
import { User } from '../../../modules/users/schema/user.schema.js';

export const generateCarts = (createdUsers: User[]) => {
  return createdUsers
    .filter((user) => user.role !== UserRole.ADMIN)
    .map((user) => ({
      userId: user.id,
    }));
};

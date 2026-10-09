import { User } from '../../modules/users/schema/user.schema.js';
export declare function assertOwnerOrAdmin(params: {
    ownerId: string;
    currentUser: User;
    message?: string;
}): boolean;

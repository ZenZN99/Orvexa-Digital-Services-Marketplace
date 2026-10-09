import { ForbiddenException } from '@nestjs/common';
import { UserRole } from '../enums/user.enum.js';
export function assertOwnerOrAdmin(params) {
    const { ownerId, currentUser, message } = params;
    const isOwner = ownerId === currentUser.id;
    const isAdmin = currentUser.role === UserRole.ADMIN;
    if (!isOwner && !isAdmin) {
        throw new ForbiddenException(message);
    }
    return true;
}
//# sourceMappingURL=assert-owner-or-admin.js.map
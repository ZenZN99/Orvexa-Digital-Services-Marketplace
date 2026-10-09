import { ForbiddenException } from '@nestjs/common';
import { UserRole } from '../enums/user.enum.js';
import { User } from '../../modules/users/schema/user.schema.js';

export function assertOwnerOrAdmin(params: {
  ownerId: string;
  currentUser: User;
  message?: string;
}) {
  const { ownerId, currentUser, message } = params;

  const isOwner = ownerId === currentUser.id;
  const isAdmin = currentUser.role === UserRole.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new ForbiddenException(message);
  }

  return true;
}

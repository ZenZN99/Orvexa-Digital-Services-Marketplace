"use client";

import { Loader2 } from "lucide-react";
import { roleLabels } from "../../utils/roleLabels";
import { IUser, UserRole } from "@/app/types/user";

interface RoleProps {
  user: IUser;
  onRoleChange?: (user: IUser, role: UserRole) => void;
  isUpdatingRole: boolean;
}

export default function Role({
  user,
  onRoleChange,
  isUpdatingRole,
}: RoleProps) {
  return (
    <td className="px-5 py-4">
      <div className="flex items-center gap-2">
        <select
          value={user.role}
          disabled={isUpdatingRole}
          onChange={(event) =>
            onRoleChange?.(user, event.target.value as UserRole)
          }
          className="rounded-lg border border-blue-500 bg-blue-500 px-3 py-2 text-xs font-medium text-white outline-none transition disabled:opacity-50"
          aria-label={`Change role for ${user.firstName} ${user.lastName}`}
        >
          {Object.values(UserRole).map((role) => (
            <option key={role} value={role}>
              {roleLabels[role]}
            </option>
          ))}
        </select>

        {isUpdatingRole && (
          <Loader2 size={13} className="animate-spin text-black/30" />
        )}
      </div>
    </td>
  );
}

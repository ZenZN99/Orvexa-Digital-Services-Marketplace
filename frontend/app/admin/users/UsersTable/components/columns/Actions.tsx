"use client";

import { IUser } from "@/app/types/user";
import { Eye, Loader2 } from "lucide-react";

interface ActionsProps {
  onSelectUser?: (user: IUser) => void;
  onToggleActive?: (user: IUser) => void;
  user: IUser;
  isBlocking: boolean;
}

export default function Actions({
  onSelectUser,
  onToggleActive,
  user,
  isBlocking,
}: ActionsProps) {
  return (
    <td className="px-5 py-4">
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => onSelectUser?.(user)}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-black/10 px-3 text-xs font-semibold text-brand-green bg-brand-green/10 transition hover:bg-brand-green/15"
        >
          <Eye className="h-4 w-4" />
          View
        </button>

        {user.isActive ? (
          <button
            type="button"
            disabled={isBlocking}
            onClick={() => onToggleActive?.(user)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-red-500/10 px-3 text-xs font-semibold text-red-600 transition hover:bg-red-500/15 disabled:opacity-50"
          >
            {isBlocking && <Loader2 size={12} className="animate-spin" />}
            Block
          </button>
        ) : (
          <span
            title="Unblock isn't available yet"
            className="inline-flex h-9 cursor-not-allowed items-center rounded-lg bg-white/4 px-3 text-xs font-semibold text-black/30"
          >
            Blocked
          </span>
        )}
      </div>
    </td>
  );
}

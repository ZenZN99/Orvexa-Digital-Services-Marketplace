"use client";

import { IUser } from "@/app/types/user";
import { ShieldCheck, ShieldOff } from "lucide-react";

export default function Account({ user }: { user: IUser }) {
  return (
    <td className="px-5 py-4">
      {user.isActive ? (
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-2.5 py-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span className="text-xs font-semibold text-emerald-600">Active</span>
        </div>
      ) : (
        <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-2.5 py-1">
          <ShieldOff className="h-3.5 w-3.5 text-red-600" />
          <span className="text-xs font-semibold text-red-600">Blocked</span>
        </div>
      )}
    </td>
  );
}

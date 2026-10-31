"use client";
import { IUser } from "@/app/types/user";
import TableCell from "@/app/admin/components/TableCell";

export default function Account({ user }: { user: IUser }) {
  return (
    <TableCell>
      {user ? (
        <span
          className={`inline-flex items-center gap-1.5 text-xs ${
            user.isActive ? "text-brand-green/80" : "text-red-300/70"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              user.isActive ? "bg-brand-green" : "bg-red-300"
            }`}
          />

          {user.isActive ? "Active" : "Blocked"}
        </span>
      ) : (
        <span className="text-xs text-white/20">—</span>
      )}
    </TableCell>
  );
}

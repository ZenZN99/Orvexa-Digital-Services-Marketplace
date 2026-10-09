"use client";

import { AlertCircle } from "lucide-react";
import TableCell from "@/app/admin/components/TableCell";
import { IUserVerification } from "@/app/types/user-verification";

export default function RejectionReason({
  verification,
}: {
  verification: IUserVerification;
}) {
  return (
    <TableCell>
      {verification.rejectionReason ? (
        <div className="flex max-w-57.5 items-center gap-2">
          <AlertCircle size={13} className="shrink-0 text-red-300/70" />

          <span
            title={verification.rejectionReason}
            className="truncate text-xs text-white/35"
          >
            {verification.rejectionReason}
          </span>
        </div>
      ) : (
        <span className="text-xs text-white/20">—</span>
      )}
    </TableCell>
  );
}

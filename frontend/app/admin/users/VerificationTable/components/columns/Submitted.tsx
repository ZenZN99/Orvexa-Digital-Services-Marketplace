"use client";

import { IUserVerification } from "@/app/types/user-verification";
import { formatDate } from "../../../UsersTable/utils/formatDate";
import { formatDateTime } from "../../utils/formatDateTime";
import TableCell from "@/app/admin/components/TableCell";

export default function Submitted({
  verification,
}: {
  verification: IUserVerification;
}) {
  return (
    <TableCell>
      <span
        title={formatDateTime(verification.submittedAt)}
        className="whitespace-nowrap text-xs text-white/40"
      >
        {formatDate(verification.submittedAt)}
      </span>
    </TableCell>
  );
}

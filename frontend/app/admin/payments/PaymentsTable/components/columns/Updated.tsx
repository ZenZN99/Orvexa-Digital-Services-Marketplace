"use client";

import TableCell from "@/app/admin/components/TableCell";
import { formatDate, formatDateTime } from "../../utils/helpers";
import { IPayment } from "@/app/types/payment";

export default function Updated({ payment }: { payment: IPayment }) {
  return (
    <TableCell>
      <span
        title={formatDateTime(payment.updatedAt)}
        className="whitespace-nowrap text-xs text-white/30"
      >
        {formatDate(payment.updatedAt)}
      </span>
    </TableCell>
  );
}

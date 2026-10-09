"use client";

import { IPayment } from "@/app/types/payment";
import TableCell from "@/app/admin/components/TableCell";
import { CalendarDays } from "lucide-react";
import { formatDate, formatDateTime } from "../../utils/helpers";

export default function Created({ payment }: { payment: IPayment }) {
  return (
    <TableCell>
      <div className="flex items-center gap-2 whitespace-nowrap">
        <CalendarDays size={13} className="text-white/25" />

        <span
          title={formatDateTime(payment.createdAt)}
          className="text-xs text-white/40"
        >
          {formatDate(payment.createdAt)}
        </span>
      </div>
    </TableCell>
  );
}

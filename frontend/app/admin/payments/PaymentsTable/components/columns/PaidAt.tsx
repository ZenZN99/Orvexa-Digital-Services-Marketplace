"use client";

import { CheckCircle2, Clock3 } from "lucide-react";
import { formatDate, formatDateTime } from "../../utils/helpers";
import TableCell from "@/app/admin/components/TableCell";
import { IPayment } from "@/app/types/payment";

export default function PaidAt({ payment }: { payment: IPayment }) {
  return (
    <TableCell>
      {payment.paidAt ? (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <CheckCircle2 size={13} className="text-brand-green/60" />

          <span
            title={formatDateTime(payment.paidAt)}
            className="text-xs text-white/45"
          >
            {formatDate(payment.paidAt)}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Clock3 size={13} className="text-white/20" />

          <span className="text-xs text-white/25">Not paid</span>
        </div>
      )}
    </TableCell>
  );
}

"use client";

import { IPayment } from "@/app/types/payment";
import TableCell from "@/app/admin/components/TableCell";
import { statusClasses } from "../../utils/helpers";

export default function Status({ payment }: { payment: IPayment }) {
  return (
    <TableCell>
      <span
        className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusClasses[payment.status]}`}
      >
        {payment.status}
      </span>
    </TableCell>
  );
}

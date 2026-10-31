"use client";

import { IPayment } from "@/app/types/payment";
import { formatCurrency } from "../../utils/helpers";
import TableCell from "@/app/admin/components/TableCell";

export default function Amount({ payment }: { payment: IPayment }) {
  return (
    <TableCell>
      <span className="whitespace-nowrap text-sm font-medium text-white">
        {formatCurrency(payment.amount)}
      </span>
    </TableCell>
  );
}

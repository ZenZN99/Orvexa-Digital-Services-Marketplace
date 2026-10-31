"use client";

import type { IPayment } from "@/app/types/payment";
import { PaymentStatus } from "@/app/types/payment";
import Empty from "./components/Empty";
import Head from "./components/Head";
import Pagination from "@/app/shared/components/Pagination";
import { formatCurrency } from "./utils/helpers";

interface PaymentsTableProps {
  payments: IPayment[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaymentsTable({
  payments,
  page,
  totalPages,
  onPageChange,
}: PaymentsTableProps) {
  if (payments.length === 0) {
    return <Empty />;
  }

  const totalAmount = payments.reduce(
    (total, payment) => total + Number(payment.amount),
    0,
  );

  const completedAmount = payments
    .filter((payment) => payment.status === PaymentStatus.COMPLETED)
    .reduce((total, payment) => total + Number(payment.amount), 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/2.5">
      <div className="overflow-x-auto">
        <Head payments={payments} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/6 px-5 py-4">
        <div className="flex flex-wrap items-center gap-5">
          <span className="text-xs text-white/30">
            {payments.length} {payments.length === 1 ? "payment" : "payments"}
          </span>

          <span className="text-xs text-white/30">
            Completed:{" "}
            <span className="text-white/50">
              {formatCurrency(completedAmount)}
            </span>
          </span>
        </div>

        <span className="text-xs font-medium text-white/45">
          Total:{" "}
          <span className="text-white/70">{formatCurrency(totalAmount)}</span>
        </span>
      </div>

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

"use client";

import PaymentRow from "./PaymentRow";
import { IPayment } from "@/app/types/payment";
import TableHead from "@/app/admin/components/TableHead";

export default function Head({ payments }: { payments: IPayment[] }) {
  return (
    <table className="w-full min-w-275">
      <thead>
        <tr className="border-b border-white/[0.07] bg-white/2">
          <TableHead>Payment</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Paid At</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Updated</TableHead>
        </tr>
      </thead>

      <tbody>
        {payments.map((payment) => (
          <PaymentRow key={payment.id} payment={payment} />
        ))}
      </tbody>
    </table>
  );
}

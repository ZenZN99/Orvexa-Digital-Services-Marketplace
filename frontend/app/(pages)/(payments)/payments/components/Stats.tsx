"use client";

import { IPayment } from "@/app/types/payment";
import { Clock3, DollarSign, Receipt } from "lucide-react";

interface StatsProps {
  totalSpent: number;
  pendingAmount: number;
  myPayments: IPayment[];
}

export default function Stats({
  totalSpent,
  pendingAmount,
  myPayments,
}: StatsProps) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-3">
      {/* Total Spent */}
      <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
        <div className="flex items-center justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-green/10">
            <DollarSign size={17} className="text-brand-green" />
          </div>

          <span className="text-xs text-white/25">Completed</span>
        </div>

        <p className="mt-5 text-2xl font-semibold tracking-tight">
          ${Number(totalSpent).toFixed(2)}
        </p>

        <p className="mt-1 text-xs text-white/35">Total spent</p>
      </div>

      {/* Pending */}
      <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
        <div className="flex items-center justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-400/8">
            <Clock3 size={17} className="text-yellow-300" />
          </div>

          <span className="text-xs text-white/25">Pending</span>
        </div>

        <p className="mt-5 text-2xl font-semibold tracking-tight">
          ${Number(pendingAmount).toFixed(2)}
        </p>

        <p className="mt-1 text-xs text-white/35">Awaiting payment</p>
      </div>

      {/* Transactions */}
      <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
        <div className="flex items-center justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
            <Receipt size={17} className="text-white/60" />
          </div>

          <span className="text-xs text-white/25">All payments</span>
        </div>

        <p className="mt-5 text-2xl font-semibold tracking-tight">
          {myPayments.length}
        </p>

        <p className="mt-1 text-xs text-white/35">Payment transactions</p>
      </div>
    </div>
  );
}

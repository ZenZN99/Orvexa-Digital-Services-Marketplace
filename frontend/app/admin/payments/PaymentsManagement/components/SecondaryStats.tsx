"use client";

import { IPayment } from "@/app/types/payment";
import { DollarSign, XCircle } from "lucide-react";

interface SecondaryStatsProps {
  payments: IPayment[];
  stats: {
    completed: number;
    failed: number;
  };
}

export default function SecondaryStats({
  payments,
  stats,
}: SecondaryStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-white/[0.07] bg-white/2.5 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/35">Successful Payment Rate</p>

            <p className="mt-2 text-2xl font-semibold text-white">
              {payments.length
                ? Math.round((stats.completed / payments.length) * 100)
                : 0}
              %
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
            <DollarSign size={18} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-white/2.5 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/35">Failed Payments</p>

            <p className="mt-2 text-2xl font-semibold text-white">
              {stats.failed}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-400/10 text-red-300">
            <XCircle size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}

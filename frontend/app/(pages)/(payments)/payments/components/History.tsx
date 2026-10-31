"use client";

import { Receipt } from "lucide-react";
import { IPayment } from "@/app/types/payment";
import Desktop from "./Desktop";
import Mobile from "./Mobile";

interface HistoryProps {
  myPayments: IPayment[];
  payments: IPayment[];
}

export default function History({ myPayments, payments }: HistoryProps) {
  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-white/8 bg-white/3">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-white/6 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-sm font-semibold">Payment history</h2>

          <p className="mt-1 text-xs text-white/30">Your recent transactions</p>
        </div>

        <span className="rounded-lg border border-white/8 bg-white/3 px-2.5 py-1 text-xs text-white/40">
          {myPayments.length} payments
        </span>
      </div>

      {payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
            <Receipt size={22} className="text-white/20" />
          </div>

          <h3 className="mt-4 text-sm font-medium text-white/60">
            No payments yet
          </h3>

          <p className="mt-1 max-w-sm text-xs leading-5 text-white/30">
            Your payment transactions will show up here.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <Desktop payments={payments} />

          {/* Mobile */}
          <Mobile payments={payments} />
        </>
      )}
    </section>
  );
}

"use client";

import Link from "next/link";
import { IPayment } from "@/app/types/payment";
import { formatDate, statusConfig } from "../utils/helpers";
import { ArrowUpRight, CreditCard, Receipt } from "lucide-react";

interface MobileProps {
  payments: IPayment[];
}

export default function Mobile({ payments }: MobileProps) {
  return (
    <div className="divide-y divide-white/5 md:hidden">
      {payments.map((payment) => {
        const config = statusConfig[payment.status];
        const StatusIcon = config.icon;

        return (
          <div key={payment.id} className="p-5 transition hover:bg-white/2">
            {/* Top */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                  <CreditCard size={16} className="text-white/45" />
                </div>

                <div>
                  <p className="text-sm font-medium text-white/85">
                    {payment.id}
                  </p>

                  <p className="mt-0.5 text-xs text-white/25">
                    {formatDate(payment.paidAt ?? payment.createdAt)}
                  </p>
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-medium ${config.className}`}
              >
                <StatusIcon size={11} />
                {config.label}
              </span>
            </div>

            {/* Info */}
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-white/25">Amount</p>

                <p className="mt-1 text-lg font-semibold">
                  ${Number(payment.amount).toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-xs text-white/25">Order</p>

                <p className="mt-1 truncate text-xs text-white/45">
                  {payment.orderId}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Link
                href={`/payments/${payment.id}`}
                className="flex h-10 items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/3 text-xs font-medium text-white/55 transition hover:border-brand-green/20 hover:bg-brand-green hover:text-brand-navy"
              >
                <Receipt size={14} />
                Payment Details
              </Link>

              <Link
                href={`/orders/${payment.orderId}`}
                className="flex h-10 items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/3 text-xs font-medium text-white/55 transition hover:border-brand-green/20 hover:bg-brand-green hover:text-brand-navy"
              >
                <ArrowUpRight size={14} />
                Order Details
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

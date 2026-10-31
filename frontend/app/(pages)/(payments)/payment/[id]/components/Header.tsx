"use client";

import { IPayment } from "@/app/types/payment";
import { CreditCard, LucideIcon } from "lucide-react";

interface HeaderProps {
  payment: IPayment;
  status: {
    className: string;
    label: string;
  };
  StatusIcon: LucideIcon;
}
export default function Header({ payment, status, StatusIcon }: HeaderProps) {
  return (
    <div className="mt-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-green/10">
            <CreditCard size={20} className="text-brand-green" />
          </div>

          <div>
            <p className="text-xs text-white/30">Payment</p>

            <h1 className="mt-0.5 text-xl font-semibold tracking-tight">
              Payment Details
            </h1>
          </div>
        </div>

        <p className="mt-4 text-sm text-white/35">
          Transaction details for payment{" "}
          <span className="text-white/60">{payment.id}</span>
        </p>
      </div>

      {/* Status */}
      <div
        className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${status.className}`}
      >
        <StatusIcon size={14} />
        {status.label}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { IPayment } from "@/app/types/payment";
import {
  ArrowUpRight,
  DollarSign,
  Hash,
  LucideIcon,
  Receipt,
} from "lucide-react";
import { formatDate } from "../../../payments/utils/helpers";

interface LeftProps {
  payment: IPayment;
  status: {
    className: string;
    label: string;
  };
  StatusIcon: LucideIcon;
}

export default function Left({ payment, status, StatusIcon }: LeftProps) {
  return (
    <div className="space-y-6">
      {/* Payment Summary */}
      <section className="rounded-2xl border border-white/8 bg-white/3">
        <div className="border-b border-white/6 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Receipt size={16} className="text-brand-green" />

            <h2 className="text-sm font-semibold">Payment Summary</h2>
          </div>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          {/* Amount */}
          <div className="rounded-xl border border-white/6 bg-white/2 p-4">
            <div className="flex items-center gap-2 text-xs text-white/30">
              <DollarSign size={14} />
              Amount
            </div>

            <p className="mt-3 text-2xl font-semibold tracking-tight">
              ${Number(payment.amount).toFixed(2)}
            </p>
          </div>

          {/* Payment ID */}
          <div className="rounded-xl border border-white/6 bg-white/2 p-4">
            <div className="flex items-center gap-2 text-xs text-white/30">
              <Hash size={14} />
              Payment ID
            </div>

            <p className="mt-3 break-all text-sm font-medium text-white/70">
              {payment.id}
            </p>
          </div>

          {/* Status */}
          <div className="rounded-xl border border-white/6 bg-white/2 p-4">
            <p className="text-xs text-white/30">Status</p>

            <div className="mt-3 flex items-center gap-2">
              <StatusIcon
                size={15}
                className={
                  status.className.includes("brand-green")
                    ? "text-brand-green"
                    : undefined
                }
              />

              <span className="text-sm font-medium text-white/70">
                {status.label}
              </span>
            </div>
          </div>

          {/* Paid At */}
          <div className="rounded-xl border border-white/6 bg-white/2 p-4">
            <p className="text-xs text-white/30">Paid At</p>

            <p className="mt-3 text-sm font-medium text-white/70">
              {formatDate(payment.paidAt)}
            </p>
          </div>
        </div>
      </section>

      {/* Order */}
      <section className="rounded-2xl border border-white/8 bg-white/3">
        <div className="flex items-center justify-between border-b border-white/6 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-sm font-semibold">Related Order</h2>

            <p className="mt-1 text-xs text-white/30">
              Order associated with this payment
            </p>
          </div>

          <Link
            href={`/order/${payment.orderId}`}
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/8 bg-white/3 px-3 text-xs font-medium text-white/50 transition hover:border-brand-green/20 hover:bg-brand-green hover:text-brand-navy"
          >
            View Order
            <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
          <div>
            <p className="text-xs text-white/25">Order ID</p>

            <Link
              href={`/order/${payment.orderId}`}
              className="mt-2 block text-sm font-medium text-white/70 transition hover:text-brand-green"
            >
              {payment.orderId}
            </Link>
          </div>

          {payment.order && (
            <>
              <div>
                <p className="text-xs text-white/25">Order Amount</p>

                <p className="mt-2 text-sm font-semibold text-white/75">
                  ${Number(payment.order.totalAmount).toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-xs text-white/25">Order Status</p>

                <p className="mt-2 text-sm font-medium capitalize text-white/60">
                  {payment.order.status.replaceAll("_", " ")}
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { formatDate, statusConfig } from "../utils/helpers";
import { IPayment } from "@/app/types/payment";
import { ArrowUpRight, CreditCard, Receipt } from "lucide-react";

interface DesktopProps {
  payments: IPayment[];
}

export default function Desktop({ payments }: DesktopProps) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full table-fixed">
        <thead>
          <tr className="border-b border-white/6 text-left">
            <th className="w-[25%] px-6 py-3 text-[11px] font-medium uppercase tracking-wider text-white/25">
              Amount
            </th>

            <th className="w-[25%] px-6 py-3 text-[11px] font-medium uppercase tracking-wider text-white/25">
              Status
            </th>

            <th className="w-[25%] px-6 py-3 text-[11px] font-medium uppercase tracking-wider text-white/25">
              Date
            </th>

            <th className="w-[25%] px-6 py-3 text-right text-[11px] font-medium uppercase tracking-wider text-white/25">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {payments.map((payment) => {
            const config = statusConfig[payment.status];
            const StatusIcon = config.icon;

            return (
              <tr
                key={payment.id}
                className="border-b border-white/5 last:border-0 transition hover:bg-white/2"
              >
                {/* Amount */}
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-white/85">
                    ${Number(payment.amount).toFixed(2)}
                  </span>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${config.className}`}
                  >
                    <StatusIcon size={12} />
                    {config.label}
                  </span>
                </td>

                {/* Date */}
                <td className="px-6 py-4 text-sm text-white/40">
                  {formatDate(payment.paidAt ?? payment.createdAt)}
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/payment/${payment.id}`}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/8 bg-white/3 px-2.5 text-xs font-medium text-white/45 transition hover:border-brand-green/20 hover:bg-brand-green hover:text-brand-navy"
                    >
                      <Receipt size={13} />
                      Payment
                    </Link>

                    <Link
                      href={`/order/${payment.orderId}`}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/8 bg-white/3 px-2.5 text-xs font-medium text-white/45 transition hover:border-brand-green/20 hover:bg-brand-green hover:text-brand-navy"
                    >
                      <ArrowUpRight size={13} />
                      Order
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

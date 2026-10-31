"use client";

import { CalendarDays, Clock3, Package } from "lucide-react";
import { formatDate } from "../../../orders/utils/formatDate";
import { IOrder } from "@/app/types/order";

interface HeaderProps {
  order: IOrder;
  status: {
    className: string;
    label: string;
  };
}

export default function Header({ order, status }: HeaderProps) {
  return (
    <section className="rounded-2xl border border-white/8 bg-white/2.5 p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
              <Package size={20} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-white/30">
                Order
              </p>

              <h1 className="mt-0.5 text-2xl font-bold tracking-tight">
                ID: {order.id}
              </h1>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-5 text-xs text-white/35">
            <span className="flex items-center gap-2">
              <CalendarDays size={14} />
              Placed {formatDate(order.createdAt)}
            </span>

            <span className="flex items-center gap-2">
              <Clock3 size={14} />
              Updated {formatDate(order.updatedAt)}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
          <span
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
          >
            {status.label}
          </span>

          <div className="sm:ml-4 sm:border-l sm:border-white/8 sm:pl-6">
            <p className="text-xs text-white/30">Order total</p>

            <p className="mt-0.5 text-2xl font-bold text-brand-green">
              ${Number(order.totalAmount).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { CalendarDays } from "lucide-react";
import { formatDate } from "../utils/formatDate";
import { IOrder } from "@/app/types/order";

interface ITopProps {
  order: IOrder;
  status: {
    className: string;
    label: string;
  };
}

export default function Top({ order, status } : ITopProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-white">Status:</span>

          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.className}`}
          >
            {status.label}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2 text-xs text-white/35">
          <CalendarDays size={13} />
          {formatDate(order.createdAt)}
        </div>
      </div>

      <div className="text-left sm:text-right">
        <p className="text-xs text-white/35">Total</p>

        <p className="mt-1 text-xl font-bold text-brand-green">
          ${Number(order.totalAmount).toFixed(2)}
        </p>
      </div>
    </div>
  );
}

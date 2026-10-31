"use client";

import { IOrder } from "@/app/types/order";
import { CheckCircle2 } from "lucide-react";

interface SummaryProps {
  services: IOrder["services"];
  order: IOrder;
  status: {
    label: string;
  };
}

export default function Summary({ order, services, status }: SummaryProps) {
  return (
    <aside>
      <div className="sticky top-28 rounded-2xl border border-white/8 bg-white/2.5 p-5">
        <h2 className="font-bold">Order Summary</h2>

        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/40">Services</span>
            <span className="text-white/70">{services.length}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-white/40">Subtotal</span>
            <span className="text-white/70">
              ${Number(order.totalAmount).toFixed(2)}
            </span>
          </div>

          <div className="h-px bg-white/7" />

          <div className="flex items-center justify-between">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-bold text-brand-green">
              ${Number(order.totalAmount).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="mt-6 rounded-xl border border-white/6 bg-white/2 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2
              size={17}
              className="mt-0.5 shrink-0 text-brand-green"
            />

            <div>
              <p className="text-sm font-semibold">{status.label}</p>

              <p className="mt-1 text-xs leading-5 text-white/35">
                Your order status will be updated as the work progresses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

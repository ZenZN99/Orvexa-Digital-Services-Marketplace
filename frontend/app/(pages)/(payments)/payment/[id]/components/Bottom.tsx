"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { IPayment } from "@/app/types/payment";

export default function Bottom({ payment }: { payment: IPayment }) {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Link
        href="/payments"
        className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/3 px-5 text-sm font-medium text-white/50 transition hover:border-white/15 hover:bg-white/5 hover:text-white"
      >
        <ArrowLeft size={15} />
        Back to Payments
      </Link>

      <Link
        href={`/order/${payment.orderId}`}
        className="flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-green px-5 text-sm font-semibold text-brand-navy transition hover:brightness-110"
      >
        View Order Details
        <ArrowUpRight size={15} />
      </Link>
    </div>
  );
}

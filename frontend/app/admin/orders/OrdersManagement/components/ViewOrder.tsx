"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { IOrder } from "@/app/types/order";
import OrderDetailsModal from "./OrderDetailsModal";

export default function ViewOrder({ order }: { order: IOrder }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-white/10 bg-white/4 px-3 py-1.5 text-xs font-medium text-white/60 transition hover:border-brand-green/20 hover:bg-brand-green hover:text-brand-navy"
      >
        <Eye size={13} />
        View
      </button>

      {open && (
        <OrderDetailsModal order={order} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

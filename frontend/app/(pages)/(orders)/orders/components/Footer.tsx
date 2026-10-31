"use client";

import Link from "next/link";
import { IOrder, OrderStatus } from "@/app/types/order";
import { ArrowRight, Trash2 } from "lucide-react";

interface IFooterProps {
  order: IOrder;
  onDelete: (orderId: string) => void;
  deleting?: boolean;
}

export default function Footer({
  order,
  onDelete,
  deleting = false,
}: IFooterProps) {
  const canDelete = order.status === OrderStatus.PENDING_PAYMENT;

  return (
    <div className="mt-5 flex justify-end gap-2 border-t border-white/6 pt-4">
      {canDelete && (
        <button
          type="button"
          onClick={() => onDelete(order.id)}
          disabled={deleting}
          className="flex items-center gap-2 rounded-xl border border-red-500/10 px-4 py-2.5 text-xs font-semibold text-red-400 transition hover:border-red-500/20 hover:bg-red-500/5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 size={14} />
          {deleting ? "Deleting..." : "Delete"}
        </button>
      )}

      <Link
        href={`/order/${order.id}`}
        className="flex items-center gap-2 rounded-xl border border-white/8 px-4 py-2.5 text-xs font-semibold text-white/70 transition hover:border-brand-green/20 hover:bg-brand-green/5 hover:text-brand-green"
      >
        View Order
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}

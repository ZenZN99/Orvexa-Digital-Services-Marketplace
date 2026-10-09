"use client";

import TableCell from "@/app/admin/components/TableCell";
import { IOrder } from "@/app/types/order";
import { ShoppingBag } from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formats";
import { statusClasses } from "../../utils/statusClasses";
import Link from "next/link";
import ViewOrder from "./ViewOrder";
import { usePresenceStore } from "@/app/stores/usePresenceStore";

export default function OrderRow({ order }: { order: IOrder }) {
  const onlineUserIds = usePresenceStore((state) => state.onlineUserIds);

  const isOnline = onlineUserIds.includes(order.client.id);

  return (
    <>
      <tr className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/2.5">
        {/* Order */}
        <TableCell>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
              <ShoppingBag size={15} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {order.id}
              </p>
            </div>
          </div>
        </TableCell>

        {/* Client */}
        <TableCell>
          <div className="flex items-center gap-2.5">
            <div className="group/avatar relative h-7 w-7 shrink-0">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/6">
                <Link href={`/profile/u/${order.client.id}`}>
                  <img
                    src={order.client.profile.avatar.url}
                    alt=""
                    className="h-7 w-7 rounded-full object-cover transition-all duration-300 hover:scale-110"
                  />
                </Link>
              </div>

              {isOnline && (
                <>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-brand-navy bg-brand-green shadow-[0_0_7px_rgba(0,220,130,0.45)]" />

                  <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-brand-navy px-2.5 py-1.5 text-[10px] font-medium text-white opacity-0 shadow-xl transition-opacity duration-200 group-hover/avatar:opacity-100">
                    Online
                  </span>
                </>
              )}
            </div>

            <span className="text-sm text-white/55">
              {order.client?.firstName}
            </span>
          </div>
        </TableCell>

        {/* Services */}
        <TableCell>
          <div className="flex max-w-62.5 items-center justify-between gap-3">
            <ViewOrder order={order} />
          </div>
        </TableCell>

        {/* Total */}
        <TableCell>
          <span className="text-sm font-medium text-white">
            {formatCurrency(order.totalAmount)}
          </span>
        </TableCell>

        {/* Status */}
        <TableCell>
          <span
            className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusClasses[order.status]}`}
          >
            {order.status}
          </span>
        </TableCell>

        {/* Created */}
        <TableCell>
          <span className="whitespace-nowrap text-xs text-white/35">
            {formatDate(order.createdAt)}
          </span>
        </TableCell>

        {/* Updated */}
        <TableCell>
          <span className="whitespace-nowrap text-xs text-white/30">
            {formatDate(order.updatedAt)}
          </span>
        </TableCell>
      </tr>
    </>
  );
}

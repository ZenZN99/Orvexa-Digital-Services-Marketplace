"use client";

import { IOrder } from "@/app/types/order";
import OrderRow from "./OrderRow";
import TableHead from "@/app/admin/components/TableHead";
import { ShoppingBag } from "lucide-react";
import Pagination from "@/app/shared/components/Pagination";

interface TablesProps {
  filteredOrders: IOrder[];
  orders: IOrder[];
  completedOrders: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Tables({
  filteredOrders,
  orders,
  completedOrders,
  page,
  totalPages,
  onPageChange,
}: TablesProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/2.5">
      <div className="overflow-x-auto">
        <table className="w-full min-w-262.5">
          <thead>
            <tr className="border-b border-white/[0.07] bg-white/2">
              <TableHead>Order</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Services</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <ShoppingBag size={28} className="text-white/15" />

          <p className="mt-3 text-sm font-medium text-white/60">
            No orders found
          </p>

          <p className="mt-1 text-xs text-white/30">
            Try changing your search or status filter.
          </p>
        </div>
      )}

      <div className="p-2">
        {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
      </div>

      {filteredOrders.length > 0 && (
        <div className="flex items-center justify-between border-t border-white/6 px-5 py-4">
          <p className="text-xs text-white/30">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>

          <p className="text-xs text-white/30">{completedOrders} completed</p>
        </div>
      )}
    </div>
  );
}

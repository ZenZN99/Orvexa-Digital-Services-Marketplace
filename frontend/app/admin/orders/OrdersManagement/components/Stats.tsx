"use client";

import { Clock3, DollarSign, Package, ShoppingBag } from "lucide-react";
import React from "react";
import { formatCurrency } from "../../utils/formats";
import StatCard from "./StatCard";
import { IOrder, OrderStatus } from "@/app/types/order";

interface StatsProps {
  orders: IOrder[];
}

export default function Stats({ orders }: StatsProps) {
  const activeOrders = orders.filter(
    (order) => order.status === OrderStatus.IN_PROGRESS,
  ).length;

  const totalValue = orders.reduce(
    (total, order) => total + Number(order.totalAmount),
    0,
  );

  const disputedOrders = orders.filter(
    (order) => order.status === OrderStatus.DISPUTED,
  ).length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={<ShoppingBag size={17} />}
        label="Total Orders"
        value={orders.length.toString()}
      />

      <StatCard
        icon={<Clock3 size={17} />}
        label="Active Orders"
        value={activeOrders.toString()}
      />

      <StatCard
        icon={<DollarSign size={17} />}
        label="Order Value"
        value={formatCurrency(totalValue)}
      />

      <StatCard
        icon={<Package size={17} />}
        label="Disputed"
        value={disputedOrders.toString()}
      />
    </div>
  );
}

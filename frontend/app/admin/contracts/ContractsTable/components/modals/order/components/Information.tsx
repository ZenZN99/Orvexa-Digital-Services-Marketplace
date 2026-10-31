"use client";

import React from "react";
import Info from "./Info";
import { CalendarDays, DollarSign, ShoppingBag } from "lucide-react";
import { formatCurrency, formatDate } from "../../../../utils/helpers";
import { IOrder } from "@/app/types/order";

interface InformationProps {
  order: IOrder;
}

export default function Information({ order }: InformationProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <Info
        icon={DollarSign}
        label="Total"
        value={formatCurrency(order?.totalAmount ?? 0)}
      />

      <Info
        icon={ShoppingBag}
        label="Status"
        value={order?.status ?? "Unknown"}
      />

      <Info
        icon={CalendarDays}
        label="Created"
        value={order?.createdAt ? formatDate(order.createdAt) : "Unknown"}
      />
    </div>
  );
}

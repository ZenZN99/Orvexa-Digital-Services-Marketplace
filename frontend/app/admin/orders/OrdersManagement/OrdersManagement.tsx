"use client";

import { useMemo, useState } from "react";
import { OrderStatus } from "@/app/types/order";
import Header from "./components/Header";
import Stats from "./components/Stats";
import Filters from "./components/Filters";
import Tables from "./components/Tables";
import { useOrders } from "@/app/hooks/useOrders";

export default function OrdersManagement() {
  const { orders, pagination, page, setPage } = useOrders(1, 10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      if (!query) {
        return matchesStatus;
      }

      const matchesSearch = [
        order.id,
        order.clientId,
        ...order.services.map((service) => service.id),
        ...order.services.map((service) => service.title),
      ].some((value) => value.toLowerCase().includes(query));

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  const completedOrders = orders.filter(
    (order) => order.status === OrderStatus.COMPLETED,
  ).length;

  return (
    <section className="space-y-6 p-6">
      <Header />

      <Stats orders={orders} />

      <Filters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <Tables
        filteredOrders={filteredOrders}
        orders={orders}
        completedOrders={completedOrders}
        page={page}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
      />
    </section>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { ServiceCategory, ServiceStatus } from "@/app/types/service";
import Header from "./components/Header";
import ServicesTable from "../ServicesTable/ServicesTable";
import Stats from "./components/Stats";
import Filters from "./components/Filters";
import ResultSummary from "./components/ResultSummary";
import { useServices } from "@/app/hooks/useServices";

export type StatusFilter = "all" | ServiceStatus;
export type CategoryFilter = "all" | ServiceCategory;

export default function ServicesManagement() {
  const {
    services,
    pendingServices,
    pagination,
    page,
    setPage,
    pendingPagination,
    pendingPage,
    setPendingPage,
    fetchPendingServices,
  } = useServices();

  useEffect(() => {
    fetchPendingServices();
  }, [fetchPendingServices]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  const filteredServices = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return services.filter((service) => {
      const matchesSearch =
        !normalizedSearch ||
        service.id.toLowerCase().includes(normalizedSearch) ||
        service.freelancerId.toLowerCase().includes(normalizedSearch) ||
        service.title.toLowerCase().includes(normalizedSearch) ||
        service.description.toLowerCase().includes(normalizedSearch) ||
        service.keywords.some((keyword) =>
          keyword.toLowerCase().includes(normalizedSearch),
        );

      const matchesStatus =
        statusFilter === "all" || service.status === statusFilter;

      const matchesCategory =
        categoryFilter === "all" || service.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [services, search, statusFilter, categoryFilter]);

  const stats = useMemo(() => {
    const published = services.filter(
      (service) => service.status === ServiceStatus.PUBLISHED,
    );

    const pending = pendingServices.filter(
      (service) => service.status === ServiceStatus.PENDING,
    );

    const totalOrders = services.reduce(
      (sum, service) => sum + service.ordersCount,
      0,
    );

    const ratedServices = services.filter((service) => service.ratingCount > 0);

    const averageRating = ratedServices.length
      ? ratedServices.reduce((sum, service) => sum + service.ratingAverage, 0) /
        ratedServices.length
      : 0;

    return {
      total: services.length,
      published: published.length,
      pending: pending.length,
      averageRating,
    };
  }, [services]);

  const categories = Object.values(ServiceCategory);

  return (
    <div className="space-y-10 p-6 lg:p-8">
      <div className="space-y-6">
        <Header />

        <Stats stats={stats} />

        <Filters
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          categories={categories}
        />

        <ResultSummary
          filteredServices={filteredServices}
          services={services}
          search={search}
          statusFilter={statusFilter}
          categoryFilter={categoryFilter}
          setSearch={setSearch}
          setStatusFilter={setStatusFilter}
          setCategoryFilter={setCategoryFilter}
        />

        <ServicesTable
          services={filteredServices}
          page={page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-white">
              Services under review
            </h2>

            <p className="mt-1 max-w-2xl text-sm text-white/40">
              Services awaiting approval or rejection by the management team
            </p>
          </div>

          <span className="w-fit shrink-0 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400">
            {pendingPagination.total} awaiting review
          </span>
        </div>

        <ServicesTable
          services={pendingServices}
          page={pendingPage}
          totalPages={pendingPagination.totalPages}
          onPageChange={setPendingPage}
        />
      </div>
    </div>
  );
}

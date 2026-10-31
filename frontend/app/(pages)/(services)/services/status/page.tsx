"use client";

import { useEffect, useMemo, useState } from "react";
import { useServices } from "@/app/hooks/useServices";
import { ServiceStatus } from "@/app/types/service";
import ProtectedRoute from "@/app/config/routes/ProtectedRoute";
import Header from "./components/Header";
import StatusFilters from "./components/StatusFilters";
import Content from "./components/Content";
import { UserRole } from "@/app/types/user";

export type Filter = "all" | ServiceStatus;

export default function ReviewServicesPage() {
  const { myServices, fetchMyServices, loading } = useServices();

  const [filter, setFilter] = useState<Filter>("all");
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    fetchMyServices().finally(() => setHasLoaded(true));
  }, [fetchMyServices]);

  const counts = useMemo(
    () => ({
      all: myServices.length,
      [ServiceStatus.PENDING]: myServices.filter(
        (s) => s.status === ServiceStatus.PENDING,
      ).length,
      [ServiceStatus.REJECTED]: myServices.filter(
        (s) => s.status === ServiceStatus.REJECTED,
      ).length,
      [ServiceStatus.PUBLISHED]: myServices.filter(
        (s) => s.status === ServiceStatus.PUBLISHED,
      ).length,
    }),
    [myServices],
  );

  const visible = useMemo(
    () =>
      filter === "all"
        ? myServices
        : myServices.filter((s) => s.status === filter),
    [myServices, filter],
  );

  const isLoading = !hasLoaded || loading.myServices;

  const tabs: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: ServiceStatus.PENDING, label: "Under review" },
    { key: ServiceStatus.REJECTED, label: "Rejected" },
    { key: ServiceStatus.PUBLISHED, label: "Published" },
  ];

  return (
    <ProtectedRoute roles={[UserRole.FREELANCER]}>
      <main className="min-h-screen bg-brand-navy pb-24 pt-20 text-white">
        <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8">
          <Header />

          <StatusFilters
            tabs={tabs}
            filter={filter}
            setFilter={setFilter}
            counts={counts}
          />

          <Content
            isLoading={isLoading}
            visible={visible}
            myServices={myServices}
          />
        </div>
      </main>
    </ProtectedRoute>
  );
}

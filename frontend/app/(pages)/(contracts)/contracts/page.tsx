"use client";

import { useEffect, useMemo, useState } from "react";
import { ContractStatus } from "@/app/types/contract";
import { useContracts } from "@/app/hooks/useContracts";
import Header from "./components/Header";
import Stats from "./components/Stats";
import SearchFilters from "./components/SearchFilters";
import EmptyState from "./components/EmptyState";
import EmptyFilter from "./components/EmptyFilter";
import Contracts from "./components/Contracts";
import ProtectedRoute from "@/app/config/routes/ProtectedRoute";
import { UserRole } from "@/app/types/user";
import Skeleton from "./components/Skeleton";

export default function ContractsPage() {
  const { myContracts, fetchMyContracts } = useContracts();

  const [hasLoaded, setHasLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContractStatus | "all">(
    "all",
  );

  useEffect(() => {
    fetchMyContracts().finally(() => setHasLoaded(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalContracts = myContracts.length;

  const activeContracts = myContracts.filter(
    (contract) =>
      contract.status === ContractStatus.IN_PROGRESS ||
      contract.status === ContractStatus.DELIVERED,
  ).length;

  const completedContracts = myContracts.filter(
    (contract) => contract.status === ContractStatus.COMPLETED,
  ).length;

  const totalValue = myContracts.reduce(
    (total, contract) => total + Number(contract.amount),
    0,
  );

  const filteredContracts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return myContracts.filter((contract) => {
      const matchesStatus =
        statusFilter === "all" || contract.status === statusFilter;

      const matchesSearch =
        !normalizedSearch ||
        contract.service?.title?.toLowerCase().includes(normalizedSearch) ||
        contract.id.toLowerCase().includes(normalizedSearch) ||
        contract.orderId.toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [myContracts, search, statusFilter]);

  const hasFilters = search.trim() !== "" || statusFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };

  if (!hasLoaded) {
    return <Skeleton />;
  }

  return (
    <ProtectedRoute roles={[UserRole.CLIENT, UserRole.FREELANCER]}>
      <main className="min-h-screen bg-brand-navy px-4 py-24 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Header />

          <Stats
            totalContracts={totalContracts}
            activeContracts={activeContracts}
            completedContracts={completedContracts}
            totalValue={totalValue}
          />

          <section className="mt-8 overflow-hidden rounded-2xl border border-white/8 bg-white/3">
            <div className="border-b border-white/6 px-5 py-4 sm:px-6">
              <h2 className="text-sm font-semibold">Contract History</h2>

              <p className="mt-1 text-xs text-white/30">
                Your recent contracts and their current status.
              </p>
            </div>

            <SearchFilters
              search={search}
              setSearch={setSearch}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              hasFilters={hasFilters}
              filteredContracts={filteredContracts}
              myContracts={myContracts}
              clearFilters={clearFilters}
            />

            {myContracts.length === 0 ? (
              <EmptyState />
            ) : filteredContracts.length === 0 ? (
              <EmptyFilter clearFilters={clearFilters} />
            ) : (
              <div className="divide-y divide-white/6">
                <Contracts filteredContracts={filteredContracts} />
              </div>
            )}
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}

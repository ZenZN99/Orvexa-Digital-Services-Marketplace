"use client";

import { useMemo, useState } from "react";
import { ContractStatus, type IContract } from "@/app/types/contract";
import ContractsTable from "../ContractsTable/ContractsTable";
import Header from "./components/Header";
import Stats from "./components/Stats";
import SearchFilter from "./components/SearchFilter";
import { statusClasses } from "./utils/helpers";
import { useContracts } from "@/app/hooks/useContracts";

export default function ContractsManagement() {
  const { contracts, page, pagination, setPage } = useContracts();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContractStatus | "all">(
    "all",
  );

  const [selectedContractId, setSelectedContractId] = useState(
    contracts[0]?.id ?? "",
  );

  const filteredContracts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return contracts.filter((contract) => {
      const matchesStatus =
        statusFilter === "all" || contract.status === statusFilter;

      if (!query) return matchesStatus;

      const matchesSearch = [
        contract.id,
        contract.orderId,
        contract.serviceId,
        contract.freelancerId,
        contract.clientId,
      ].some((value) => value.toLowerCase().includes(query));

      return matchesStatus && matchesSearch;
    });
  }, [contracts, search, statusFilter]);

  const selectedContract = contracts.find(
    (contract) => contract.id === selectedContractId,
  );

  const totalValue = contracts.reduce((total, contract) => {
    const amount = Number(contract.amount);

    return total + (Number.isFinite(amount) ? amount : 0);
  }, 0);
  const activeCount = contracts.filter(
    (contract) =>
      contract.status === ContractStatus.IN_PROGRESS ||
      contract.status === ContractStatus.DELIVERED,
  ).length;

  const disputedCount = contracts.filter(
    (contract) => contract.status === ContractStatus.DISPUTED,
  ).length;

  return (
    <section className="space-y-6 p-6">
      <Header />

      <Stats
        contracts={contracts}
        activeCount={activeCount}
        totalValue={totalValue}
        disputedCount={disputedCount}
      />

      <SearchFilter
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <ContractsTable
        contracts={filteredContracts}
        selectedContract={selectedContract}
        selectedContractId={selectedContractId}
        setSelectedContractId={setSelectedContractId}
        statusClasses={statusClasses}
        page={page}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
      />
    </section>
  );
}

"use client";

import { ContractStatus, type IContract } from "@/app/types/contract";
import Head from "./components/Head";
import TableFooter from "./components/TableFooter";
import ContractRow from "./components/ContractRow";
import ContractMessages from "./components/ContractMessages";
import EmptyState from "./components/EmptyState";
import { useMessages } from "@/app/hooks/useMessages";
import Pagination from "@/app/shared/components/Pagination";

interface ContractsTableProps {
  contracts: IContract[];
  selectedContract?: IContract;
  selectedContractId: string;
  setSelectedContractId: (id: string) => void;
  statusClasses: Record<ContractStatus, string>;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ContractsTable({
  contracts,
  selectedContract,
  selectedContractId,
  setSelectedContractId,
  statusClasses,
  page,
  totalPages,
  onPageChange,
}: ContractsTableProps) {
  const { messages, page: messagesPage, pagination, setPage } = useMessages();
  const contractMessages = messages.filter(
    (message) => message.contractId === selectedContractId,
  );

  if (contracts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/2.5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-275">
            <Head />

            <tbody>
              {contracts.map((contract) => (
                <ContractRow
                  key={contract.id}
                  contract={contract}
                  selected={contract.id === selectedContractId}
                  onSelect={() => setSelectedContractId(contract.id)}
                  statusClasses={statusClasses}
                />
              ))}
            </tbody>
          </table>
        </div>

        <TableFooter contracts={contracts} />

        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>

      <ContractMessages
        contracts={contracts}
        selectedContractId={selectedContractId}
        setSelectedContractId={setSelectedContractId}
        selectedContract={selectedContract}
        contractMessages={contractMessages}
        page={messagesPage}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

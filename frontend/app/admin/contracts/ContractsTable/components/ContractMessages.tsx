"use client";

import { useMemo, useState } from "react";
import { IContract } from "@/app/types/contract";
import { IMessage } from "@/app/types/message";
import { MessageSquare, Search } from "lucide-react";
import ContractMeta from "./ContractMeta";
import MessageRow from "./MessageRow";
import TableHead from "@/app/admin/components/TableHead";
import Pagination from "@/app/shared/components/Pagination";

interface ContractMessagesProps {
  contracts: IContract[];
  selectedContractId: string;
  setSelectedContractId: (value: string) => void;
  selectedContract?: IContract;
  contractMessages: IMessage[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ContractMessages({
  contracts,
  selectedContractId,
  setSelectedContractId,
  selectedContract,
  contractMessages,
  page,
  totalPages,
  onPageChange,
}: ContractMessagesProps) {
  const [search, setSearch] = useState("");

  const filteredContracts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return contracts;
    }

    return contracts.filter((contract) => {
      const clientName =
        `${contract.client.firstName} ${contract.client.lastName}`.toLowerCase();

      const serviceTitle = contract.service.title.toLowerCase();

      return (
        clientName.includes(query) ||
        serviceTitle.includes(query) ||
        contract.id.toLowerCase().includes(query) ||
        contract.orderId.toLowerCase().includes(query)
      );
    });
  }, [contracts, search]);

  const handleContractSelect = (contractId: string) => {
    setSelectedContractId(contractId);
  };

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/2.5">
      <div className="flex flex-col gap-4 border-b border-white/[0.07] p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare size={17} className="text-brand-green" />

            <h3 className="text-sm font-semibold text-white">
              Contract Messages
            </h3>
          </div>

          <p className="mt-1 text-xs text-white/30">
            View the conversation between the client and freelancer.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search contracts..."
            className="h-10 w-full rounded-xl border border-white/8 bg-white/3 pl-9 pr-3 text-sm text-white/70 outline-none transition"
          />
        </div>
      </div>

      {filteredContracts.length > 0 && (
        <div className="border-b border-white/6 px-5 py-3">
          <div className="flex flex-wrap gap-2">
            {filteredContracts.map((contract) => (
              <button
                key={contract.id}
                type="button"
                onClick={() => handleContractSelect(contract.id)}
                className={`rounded-xl border px-3 py-2 text-left transition ${
                  contract.id === selectedContractId
                    ? "border-brand-green/30 bg-brand-green/10"
                    : "border-white/8 bg-white/2 hover:border-brand-green/20 hover:bg-white/4"
                }`}
              >
                <p
                  className={`text-xs font-medium ${
                    contract.id === selectedContractId
                      ? "text-brand-green"
                      : "text-white/70"
                  }`}
                >
                  {contract.client.firstName} {contract.client.lastName}
                </p>

                <p className="mt-0.5 max-w-45 truncate text-[10px] text-white/30">
                  {contract.service.title}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredContracts.length === 0 && (
        <div className="border-b border-white/6 px-5 py-6 text-center">
          <p className="text-xs text-white/30">
            No contracts found matching your search.
          </p>
        </div>
      )}

      {selectedContract && (
        <div className="grid grid-cols-1 gap-4 border-b border-white/6 p-5 md:grid-cols-3">
          <ContractMeta label="Contract" value={selectedContract.id} />

          <ContractMeta
            label="Freelancer"
            value={
              selectedContract.freelancer.user.firstName +
              " " +
              selectedContract.freelancer.user.lastName
            }
          />

          <ContractMeta
            label="Client"
            value={
              selectedContract.client.firstName +
              " " +
              selectedContract.client.lastName
            }
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-212.5">
          <thead>
            <tr className="border-b border-white/6">
              <TableHead>Sender</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Attachments</TableHead>
              <TableHead>Sent</TableHead>
            </tr>
          </thead>

          <tbody>
            {contractMessages.map((message) => (
              <MessageRow key={message.id} message={message} />
            ))}
          </tbody>
        </table>
      </div>

      {contractMessages.length === 0 && (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/4">
            <MessageSquare size={19} className="text-white/20" />
          </div>

          <p className="mt-3 text-sm font-medium text-white/50">No messages</p>

          <p className="mt-1 text-xs text-white/25">
            This contract does not have any messages yet.
          </p>
        </div>
      )}

      {contractMessages.length > 0 && (
        <div className="border-t border-white/6 px-5 py-4">
          <span className="text-xs text-white/30">
            {contractMessages.length}{" "}
            {contractMessages.length === 1 ? "message" : "messages"}
          </span>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { ContractStatus, IContract } from "@/app/types/contract";
import TableCell from "@/app/admin/components/TableCell";
import { CalendarDays, Clock3, DollarSign, Eye } from "lucide-react";
import { formatCurrency, formatDate } from "../utils/helpers";
import ContractModal from "./modals/contract/ContractModal";
import OrderModal from "./modals/order/OrderModal";
import { usePresenceStore } from "@/app/stores/usePresenceStore";

interface ContractRowProps {
  contract: IContract;
  selected: boolean;
  onSelect: () => void;
  statusClasses: Record<ContractStatus, string>;
}

export default function ContractRow({
  contract,
  selected,
  onSelect,
  statusClasses,
}: ContractRowProps) {
  const [showContractModal, setShowContractModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const onlineUserIds = usePresenceStore((state) => state.onlineUserIds);

  const freelancerUser = contract.freelancer.user;
  const client = contract.client;

  const isFreelancerOnline = freelancerUser
    ? onlineUserIds.includes(freelancerUser.id)
    : false;

  const isClientOnline = client ? onlineUserIds.includes(client.id) : false;

  return (
    <>
      <tr
        onClick={onSelect}
        className={`cursor-pointer border-b border-white/5 transition-colors last:border-0 ${
          selected ? "bg-brand-green/5" : "hover:bg-white/2.5"
        }`}
      >
        <TableCell>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setShowContractModal(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/3 px-3 py-1.5 text-xs font-medium text-white/60 transition hover:border-brand-green/30 hover:bg-brand-green/10 hover:text-brand-green"
          >
            <Eye size={14} />
            View
          </button>
        </TableCell>

        <TableCell>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setShowOrderModal(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/3 px-3 py-1.5 text-xs font-medium text-white/60 transition hover:border-brand-green/30 hover:bg-brand-green/10 hover:text-brand-green"
          >
            <Eye size={14} />
            View
          </button>
        </TableCell>

        {/* Freelancer */}
        <TableCell>
          <div className="flex items-center gap-2.5">
            <div className="group/avatar relative h-7 w-7 shrink-0">
              <img
                src={freelancerUser?.profile?.avatar?.url}
                alt=""
                className="h-7 w-7 rounded-full object-cover"
              />

              {isFreelancerOnline && (
                <>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-brand-navy bg-brand-green shadow-[0_0_7px_rgba(0,220,130,0.45)]" />

                  <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-brand-navy px-2.5 py-1.5 text-[10px] font-medium text-white opacity-0 shadow-xl transition-opacity duration-200 group-hover/avatar:opacity-100">
                    Online
                  </span>
                </>
              )}
            </div>

            <span className="truncate text-sm font-medium text-white">
              {freelancerUser?.firstName} {freelancerUser?.lastName}
            </span>
          </div>
        </TableCell>

        {/* Client */}
        <TableCell>
          <div className="flex items-center gap-2.5">
            <div className="group/avatar relative h-7 w-7 shrink-0">
              <img
                src={client?.profile?.avatar?.url}
                alt=""
                className="h-7 w-7 rounded-full object-cover"
              />

              {isClientOnline && (
                <>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-brand-navy bg-brand-green shadow-[0_0_7px_rgba(0,220,130,0.45)]" />

                  <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-brand-navy px-2.5 py-1.5 text-[10px] font-medium text-white opacity-0 shadow-xl transition-opacity duration-200 group-hover/avatar:opacity-100">
                    Online
                  </span>
                </>
              )}
            </div>

            <span className="truncate text-sm font-medium text-white">
              {client?.firstName} {client?.lastName}
            </span>
          </div>
        </TableCell>

        <TableCell>
          <div className="flex items-center gap-1.5">
            <DollarSign size={14} className="text-brand-green/70" />

            <span className="text-sm font-medium text-white">
              {formatCurrency(contract.amount)}
            </span>
          </div>
        </TableCell>

        <TableCell>
          <div className="flex items-center gap-1.5 text-white/50">
            <Clock3 size={14} />
            <span className="text-sm">{contract.deliveryDays} days</span>
          </div>
        </TableCell>

        <TableCell>
          <div className="flex items-center gap-2 text-white/50">
            <CalendarDays size={14} />
            <span className="text-sm">{formatDate(contract.deadline)}</span>
          </div>
        </TableCell>

        <TableCell>
          <span
            className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium ${
              statusClasses[contract.status]
            }`}
          >
            {contract.status}
          </span>
        </TableCell>

        <TableCell>
          <span className="whitespace-nowrap text-sm text-white/35">
            {formatDate(contract.createdAt)}
          </span>
        </TableCell>
      </tr>

      {showContractModal && (
        <ContractModal
          contract={contract}
          onClose={() => setShowContractModal(false)}
        />
      )}

      {showOrderModal && (
        <OrderModal
          order={contract.order}
          client={contract.client}
          onClose={() => setShowOrderModal(false)}
        />
      )}
    </>
  );
}

"use client";

import Link from "next/link";
import { formatDate, statusConfig } from "../utils/helpers";
import { IContract } from "@/app/types/contract";
import { ArrowUpRight, CalendarDays } from "lucide-react";

interface ContractsProps {
  filteredContracts: IContract[];
}

export default function Contracts({ filteredContracts }: ContractsProps) {
  return (
    <div>
      {filteredContracts.map((contract) => {
        const status = statusConfig[contract.status];
        const StatusIcon = status.icon;

        return (
          <div
            key={contract.id}
            className="group px-5 py-5 transition hover:bg-white/2 sm:px-6"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              {/* Main */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="truncate text-sm font-semibold text-white/85">
                    {contract.service?.title ?? "Untitled Service"}
                  </h3>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-medium ${status.className}`}
                  >
                    <StatusIcon size={12} />
                    {status.label}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/30">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={13} />
                    Deadline {formatDate(contract.deadline)}
                  </span>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center justify-between gap-6 lg:justify-end">
                <div>
                  <p className="text-xs text-white/30">Amount</p>

                  <p className="mt-1 text-sm font-semibold text-white/80">
                    ${Number(contract.amount).toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-white/30">Delivery</p>

                  <p className="mt-1 text-sm font-medium text-white/65">
                    {contract.deliveryDays} days
                  </p>
                </div>

                <Link
                  href={`/contract/${contract.id}`}
                  className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/8 bg-white/3 px-3 text-xs font-medium text-white/45 transition hover:border-brand-green/20 hover:bg-brand-green hover:text-brand-navy"
                >
                  View
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

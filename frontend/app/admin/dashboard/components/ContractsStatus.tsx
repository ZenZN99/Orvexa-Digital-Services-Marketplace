"use client";
import { FileText } from "lucide-react";
import DashboardPanel from "./DashboardPanel";
import { IContract } from "@/app/types/contract";
import AnimatedNumber from "./AnimatedNumber";
import { CSSProperties } from "react";
import { CONTRACT_GROUPS } from "../utils/helpers";
import Skeleton from "./Skeleton";

interface ContractStatusItem {
  label: string;
  value: number;
  percentage: number;
  className: string;
}

interface ContractStatusProps {
  contractsReady: boolean;
  contractStatus: ContractStatusItem[];
  contractsTotal: number;
  contractsPartial: boolean;
  contracts: {
    contracts: IContract[]
  };
}

export default function ContractsStatus({
  contractsReady,
  contractStatus,
  contractsTotal,
  contractsPartial,
  contracts,
}: ContractStatusProps) {
  return (
    <DashboardPanel
      delay={360}
      title="Contract Status"
      description="Current distribution of platform contracts."
      icon={FileText}
    >
      <div className="mt-6 space-y-5">
        {contractsReady
          ? contractStatus.map((status, index) => (
              <div key={status.label}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${status.className}`}
                    />

                    <span className="text-xs text-white/55">
                      {status.label}
                    </span>
                  </div>

                  <span className="text-xs font-medium text-white/60">
                    <AnimatedNumber value={status.value} />
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-white/6">
                  <div
                    className={`dash-grow-x h-full origin-left rounded-full ${status.className}`}
                    style={
                      {
                        width: `${status.percentage}%`,
                        "--d": `${480 + index * 90}ms`,
                      } as CSSProperties
                    }
                  />
                </div>
              </div>
            ))
          : CONTRACT_GROUPS.map((group) => (
              <div key={group.label}>
                <Skeleton className="mb-2 h-3 w-24" />
                <Skeleton className="h-1.5 w-full rounded-full" />
              </div>
            ))}
      </div>

      <div className="mt-7 flex items-center justify-between border-t border-white/6 pt-5">
        <span className="text-xs text-white/30">Total contracts</span>

        <span className="text-sm font-semibold text-white">
          {contractsReady ? (
            <AnimatedNumber value={contractsTotal} />
          ) : (
            <Skeleton className="h-4 w-12" />
          )}
        </span>
      </div>

      {contractsReady && contractsPartial && (
        <p className="mt-3 text-[11px] text-white/25">
          Distribution based on the latest {contracts.contracts.length} contracts.
        </p>
      )}
    </DashboardPanel>
  );
}

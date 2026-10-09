"use client";

import StatCard from "./StatCard";
import { Clock3, DollarSign, FileText, UserRound } from "lucide-react";
import { formatCurrency } from "../utils/helpers";
import { IContract } from "@/app/types/contract";

interface StatsProps {
  contracts: IContract[];
  activeCount: number;
  totalValue: number;
  disputedCount: number;
}

export default function Stats({
  contracts,
  activeCount,
  totalValue,
  disputedCount,
}: StatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={<FileText size={17} />}
        label="Total Contracts"
        value={contracts.length.toString()}
      />

      <StatCard
        icon={<Clock3 size={17} />}
        label="Active Contracts"
        value={activeCount.toString()}
      />

      <StatCard
        icon={<DollarSign size={17} />}
        label="Contract Value"
        value={formatCurrency(totalValue)}
      />

      <StatCard
        icon={<UserRound size={17} />}
        label="Disputed"
        value={disputedCount.toString()}
      />
    </div>
  );
}

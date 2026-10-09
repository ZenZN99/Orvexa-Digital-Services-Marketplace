"use client";

interface StatsProps {
  totalContracts: number;
  activeContracts: number;
  completedContracts: number;
  totalValue: number;
}

export default function Stats({
  totalContracts,
  activeContracts,
  completedContracts,
  totalValue,
}: StatsProps) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
        <p className="text-xs text-white/30">Total Contracts</p>

        <p className="mt-3 text-2xl font-semibold">{totalContracts}</p>

        <p className="mt-1 text-xs text-white/25">All contracts</p>
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
        <p className="text-xs text-white/30">Active</p>

        <p className="mt-3 text-2xl font-semibold">{activeContracts}</p>

        <p className="mt-1 text-xs text-white/25">In progress or delivered</p>
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
        <p className="text-xs text-white/30">Completed</p>

        <p className="mt-3 text-2xl font-semibold text-brand-green">
          {completedContracts}
        </p>

        <p className="mt-1 text-xs text-white/25">Successfully completed</p>
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
        <p className="text-xs text-white/30">Total Value</p>

        <p className="mt-3 text-2xl font-semibold">${totalValue.toFixed(2)}</p>

        <p className="mt-1 text-xs text-white/25">Contract value</p>
      </div>
    </div>
  );
}

"use client";


import PaymentStatCard from "./PaymentStatCard";
import { CheckCircle2, Clock3, CreditCard, RotateCcw } from "lucide-react";

interface StatsProps {
  stats: {
    total: number;
    completed: number;
    completedAmount: number;
    pending: number;
    pendingAmount: number;
    refunded: number;
    refundedAmount: number;
  };
}

export default function Stats({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <PaymentStatCard
        label="Total Payments"
        value={stats.total.toLocaleString()}
        icon={CreditCard}
      />

      <PaymentStatCard
        label="Completed"
        value={stats.completed.toLocaleString()}
        description={`$${stats.completedAmount.toLocaleString()} processed`}
        icon={CheckCircle2}
        iconClassName="text-brand-green"
        iconBackground="bg-brand-green/10"
      />

      <PaymentStatCard
        label="Pending"
        value={stats.pending.toLocaleString()}
        description={`$${stats.pendingAmount.toLocaleString()} pending`}
        icon={Clock3}
        iconClassName="text-yellow-300"
        iconBackground="bg-yellow-400/10"
      />

      <PaymentStatCard
        label="Refunded"
        value={stats.refunded.toLocaleString()}
        description={`$${stats.refundedAmount.toLocaleString()} refunded`}
        icon={RotateCcw}
        iconClassName="text-purple-300"
        iconBackground="bg-purple-400/10"
      />
    </div>
  );
}

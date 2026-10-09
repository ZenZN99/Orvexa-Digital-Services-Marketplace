"use client";

import ServiceStatCard from "./ServiceStatCard";
import { CheckCircle2, Clock3, Package, Star, XCircle } from "lucide-react";

interface StatsProps {
  stats: {
    total: number;
    published: number;
    pending: number;
  };
}

export default function Stats({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4  xl:grid-cols-3">
      <ServiceStatCard
        label="Total Services"
        value={stats.total.toLocaleString()}
        icon={Package}
      />

      <ServiceStatCard
        label="Published"
        value={stats.published.toLocaleString()}
        icon={CheckCircle2}
        iconClassName="text-brand-green"
        iconBackground="bg-brand-green/10"
      />

      <ServiceStatCard
        label="Pending Review"
        value={stats.pending.toLocaleString()}
        icon={Clock3}
        iconClassName="text-yellow-300"
        iconBackground="bg-yellow-400/10"
      />
    </div>
  );
}

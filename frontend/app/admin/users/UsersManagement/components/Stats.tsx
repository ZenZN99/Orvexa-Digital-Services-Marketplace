"use client";

import { CheckCircle2, ShieldCheck, Users, XCircle } from "lucide-react";
import StatCard from "./StatCard";

interface StatsProps {
  stats: {
    total: number;
    active: number;
    blocked: number;
    freelancers: number;
    clients: number;
    pendingVerification: number;
  };
}

export default function Stats({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total Users" value={stats.total} icon={Users} />

      <StatCard
        label="Active Users"
        value={stats.active}
        icon={CheckCircle2}
        accent
      />

      <StatCard label="Blocked Users" value={stats.blocked} icon={XCircle} />

      <StatCard
        label="Pending Verification"
        value={stats.pendingVerification}
        icon={ShieldCheck}
        accent
      />
    </div>
  );
}

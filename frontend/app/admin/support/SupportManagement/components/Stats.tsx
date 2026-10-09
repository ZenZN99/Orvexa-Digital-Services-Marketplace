"use client";

import { CheckCircle2, Clock2, MessageSquare, Users } from "lucide-react";
import StatCard from "./StatCard";

interface StatsProps {
  stats: {
    total: number;
    open: number;
    closed: number;
    uniqueUsers: number;
  };
}

export default function Stats({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total Conversations"
        value={stats.total}
        icon={MessageSquare}
      />

      <StatCard label="Open" value={stats.open} icon={Clock2} accent="green" />

      <StatCard label="Closed" value={stats.closed} icon={CheckCircle2} />

      <StatCard label="Users" value={stats.uniqueUsers} icon={Users} />
    </div>
  );
}

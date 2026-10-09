"use client";

import React from "react";
import StatCard from "./StatCard";
import { CheckCircle2, Clock3, Users } from "lucide-react";

interface StatsProps {
  stats: {
    total: number;
    open: number;
    closed: number;
  };
}

export default function Stats({ stats }: StatsProps) {
  return (
    <div className="mb-6 grid grid-cols-3 gap-3">
      <StatCard label="Total" value={stats.total} icon={Users} />
      <StatCard label="Open" value={stats.open} icon={Clock3} accent="green" />
      <StatCard label="Closed" value={stats.closed} icon={CheckCircle2} />
    </div>
  );
}

"use client";

import { Users } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon: typeof Users;
  accent?: "green";
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/2.5 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-white/35">{label}</p>
          <p className="mt-1.5 text-2xl font-bold text-white">{value}</p>
        </div>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
            accent === "green"
              ? "bg-brand-green/10 text-brand-green"
              : "bg-white/5 text-white/30"
          }`}
        >
          <Icon size={16} />
        </div>
      </div>
    </div>
  );
}

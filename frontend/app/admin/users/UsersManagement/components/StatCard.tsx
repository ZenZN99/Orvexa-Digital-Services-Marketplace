"use client";

import { Users } from "lucide-react";

interface StatCard {
  label: string;
  value: number;
  icon: typeof Users;
  accent?: boolean;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent = false,
}: StatCard) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-brand-navy/25 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-white/30">{label}</p>

          <p className="mt-2 text-2xl font-semibold text-white">
            {value.toLocaleString()}
          </p>
        </div>

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
            accent
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

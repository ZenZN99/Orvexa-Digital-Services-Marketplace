"use client";

import { MessageSquare } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon: typeof MessageSquare;
  accent?: "green";
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/2.5 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-white/30">{label}</p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
            {value.toLocaleString()}
          </p>
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

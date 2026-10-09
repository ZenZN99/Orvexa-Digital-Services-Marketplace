"use client";

import { UserRound } from "lucide-react";

interface InfoCardProps {
  icon: typeof UserRound;
  label: string;
  value: string;
}

export default function InfoCard({ icon: Icon, label, value }: InfoCardProps) {
  return (
    <div className="rounded-xl border border-white/6 bg-white/2 p-4">
      <div className="flex items-center gap-2">
        <Icon size={13} className="text-white/25" />

        <span className="text-[11px] font-medium text-white/30">{label}</span>
      </div>

      <p
        title={value}
        className="mt-2 truncate text-sm font-medium text-white/65"
      >
        {value}
      </p>
    </div>
  );
}

"use client";

import { DollarSign } from "lucide-react";

interface InfoProps {
  icon: typeof DollarSign;
  label: string;
  value: string;
}

export default function Info({ icon: Icon, label, value }: InfoProps) {
  return (
    <div className="rounded-xl border border-white/6 bg-white/2.5 p-3.5">
      <div className="flex items-center gap-1.5">
        <Icon size={13} className="text-brand-green/70" />

        <p className="text-[10px] font-medium uppercase tracking-wider text-white/25">
          {label}
        </p>
      </div>

      <p className="mt-1.5 truncate text-sm font-medium text-white/70">
        {value}
      </p>
    </div>
  );
}

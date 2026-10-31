"use client";

import { Users } from "lucide-react";

interface SectionHeaderProps {
  icon: typeof Users;
  title: string;
  count: number;
}

export default function SectionHeader({
  icon: Icon,
  title,
  count,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-2">
        <Icon size={15} className="text-brand-green" />

        <h3 className="text-sm font-medium text-white/70">{title}</h3>
      </div>

      <span className="text-xs text-white/25">{count}</span>
    </div>
  );
}

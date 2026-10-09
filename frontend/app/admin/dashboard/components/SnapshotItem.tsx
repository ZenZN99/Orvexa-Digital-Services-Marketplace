"use client";

import { Users } from "lucide-react";
import Skeleton from "./Skeleton";
import AnimatedNumber from "./AnimatedNumber";

interface SnapshotItemProps {
  icon: typeof Users;
  label: string;
  value: number;
  caption?: string;
  ready: boolean;
}

export default function SnapshotItem({
  icon: Icon,
  label,
  value,
  caption,
  ready,
}: SnapshotItemProps) {
  return (
    <div className="group rounded-xl border border-white/6 bg-white/2 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-green/20 hover:bg-white/4">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/4 text-white/40 transition-colors duration-300 group-hover:bg-brand-green/10 group-hover:text-brand-green">
        <Icon size={14} />
      </div>

      <p className="mt-4 text-[10px] font-medium uppercase tracking-widest text-white/25">
        {label}
      </p>

      <div className="mt-1 text-lg font-semibold text-white">
        {ready ? (
          <AnimatedNumber value={value} />
        ) : (
          <Skeleton className="h-6 w-16" />
        )}
      </div>

      {caption && ready && (
        <p className="mt-0.5 text-[10px] text-white/25">{caption}</p>
      )}
    </div>
  );
}

"use client";

import { ArrowDownRight, ArrowUpRight, Users } from "lucide-react";
import Reveal from "./Reveal";
import AnimatedNumber from "./AnimatedNumber";
import Skeleton from "./Skeleton";

interface StatCardProps {
  label: string;
  icon: typeof Users;
  value: number;
  currency?: boolean;
  change: number | null;
  caption: string;
  ready: boolean;
  delay: number;
}

export default function StatCard({
  label,
  icon: Icon,
  value,
  currency = false,
  change,
  caption,
  ready,
  delay,
}: StatCardProps) {
  const positive = (change ?? 0) >= 0;

  return (
    <Reveal delay={delay}>
      <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.07] bg-white/2.5 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/25 hover:bg-white/4 hover:shadow-[0_18px_40px_-24px_rgba(0,220,130,0.45)]">
        {/* Hover glow */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand-green/15 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Icon size={18} strokeWidth={1.8} />
          </div>

          {ready && change !== null && (
            <div
              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                positive
                  ? "bg-brand-green/10 text-brand-green"
                  : "bg-red-400/10 text-red-400"
              }`}
            >
              {positive ? (
                <ArrowUpRight size={13} />
              ) : (
                <ArrowDownRight size={13} />
              )}
              {positive ? "+" : "-"}
              {Math.abs(change).toFixed(1)}%
            </div>
          )}
        </div>

        <p className="relative mt-5 text-xs font-medium uppercase tracking-widest text-white/30">
          {label}
        </p>

        <div className="relative mt-1 text-2xl font-semibold tracking-tight text-white">
          {ready ? (
            <AnimatedNumber value={value} currency={currency} />
          ) : (
            <Skeleton className="h-8 w-28" />
          )}
        </div>

        <div className="relative mt-1 text-[11px] text-white/25">
          {ready ? caption : <Skeleton className="mt-2 h-3 w-36" />}
        </div>
      </div>
    </Reveal>
  );
}

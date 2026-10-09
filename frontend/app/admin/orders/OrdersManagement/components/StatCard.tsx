"use client";

import React from "react";

export default function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/2.5 p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
        {icon}
      </div>

      <p className="mt-5 text-xs font-medium uppercase tracking-[0.12em] text-white/30">
        {label}
      </p>

      <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
        {value}
      </p>
    </div>
  );
}

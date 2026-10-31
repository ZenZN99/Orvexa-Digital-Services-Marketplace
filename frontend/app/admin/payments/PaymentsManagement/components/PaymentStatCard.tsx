"use client";

import { CreditCard } from "lucide-react";

interface PaymentStatCardProps {
  label: string;
  value: string;
  description?: string;
  icon: typeof CreditCard;
  iconClassName?: string;
  iconBackground?: string;
}

export default function PaymentStatCard({
  label,
  value,
  description,
  icon: Icon,
  iconClassName = "text-white/40",
  iconBackground = "bg-white/[0.04]",
}: PaymentStatCardProps) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/2.5 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs text-white/35">{label}</p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
            {value}
          </p>

          {description ? (
            <p className="mt-1 text-[11px] text-white/25">{description}</p>
          ) : null}
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBackground}`}
        >
          <Icon size={18} className={iconClassName} />
        </div>
      </div>
    </div>
  );
}

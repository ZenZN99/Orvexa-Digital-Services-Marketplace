"use client";

import { IUserVerification } from "@/app/types/user-verification";
import { formatDate } from "../utils/formatDate";
import { LucideIcon } from "lucide-react";

interface StatusConfig {
  icon: LucideIcon;
  label: string;
  className: string;
}
interface StatusProps {
  verification: IUserVerification;
  StatusIcon: LucideIcon;
  config: StatusConfig;
}

export default function Status({
  verification,
  StatusIcon,
  config,
}: StatusProps) {
  return (
    <section className="rounded-2xl border border-white/[0.07] bg-white/2.5 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/25">
            Current Status
          </p>

          <div className="mt-2 flex items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${config.className}`}
            >
              <StatusIcon size={13} />
              {config.label}
            </span>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/25">
            Submitted
          </p>

          <p className="mt-2 text-xs text-white/50">
            {formatDate(verification.submittedAt)}
          </p>
        </div>
      </div>
    </section>
  );
}

"use client";

import { IContract } from "@/app/types/contract";
import { UserRound } from "lucide-react";
import Link from "next/link";
import { usePresenceStore } from "@/app/stores/usePresenceStore";

interface FreelancerProps {
  avatarUrl: string;
  freelancerId: string;
  freelancerName: string;
  contract: IContract;
}

export default function Freelancer({
  avatarUrl,
  freelancerName,
  freelancerId,
  contract,
}: FreelancerProps) {
  const onlineUserIds = usePresenceStore(
    (state) => state.onlineUserIds,
  );

  const isOnline = onlineUserIds.includes(freelancerId);

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/2.5 p-5 sm:p-6">
      <p className="text-[11px] font-medium uppercase tracking-wider text-white/25">
        Freelancer
      </p>

      <div className="mt-4 flex items-center gap-4">
        <div className="group/avatar relative h-12 w-12 shrink-0">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white/6 transition-all duration-300 group-hover/avatar:scale-110">
            {avatarUrl ? (
              <Link href={`/freelancer/u/${freelancerId}`}>
                <img
                  src={avatarUrl}
                  alt={freelancerName}
                  className="h-full w-full object-cover"
                />
              </Link>
            ) : (
              <UserRound size={20} className="text-white/25" />
            )}
          </div>

          {isOnline && (
            <>
              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-brand-navy bg-brand-green shadow-[0_0_8px_rgba(0,220,130,0.45)]" />

              <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-brand-navy px-2.5 py-1.5 text-[10px] font-medium text-white opacity-0 shadow-xl transition-opacity duration-200 group-hover/avatar:opacity-100">
                Online
              </span>
            </>
          )}
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-white">
            {freelancerName}
          </h2>

          <p className="mt-1 text-xs text-white/35">
            {contract.freelancer?.jobTitle || "Freelancer"}
          </p>
        </div>
      </div>
    </div>
  );
}
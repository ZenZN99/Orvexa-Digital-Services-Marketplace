"use client";

import { IUser } from "@/app/types/user";
import { ArrowRightFromLine } from "lucide-react";
import Link from "next/link";
import { usePresenceStore } from "@/app/stores/usePresenceStore";

interface GridProps {
  visibleFreelancers: IUser[];
}

export default function Grid({ visibleFreelancers }: GridProps) {
  const onlineUserIds = usePresenceStore((state) => state.onlineUserIds);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {visibleFreelancers.map((freelancer) => {
        const fullName = `${freelancer.firstName} ${freelancer.lastName}`;
        const avatarUrl = freelancer.profile?.avatar?.url;
        const isOnline = onlineUserIds.includes(freelancer.id);

        return (
          <article
            key={freelancer.id}
            className="rounded-xl border border-white/6 bg-white/2 p-4 transition-colors hover:border-brand-green/20"
          >
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-sm font-semibold text-white/50">
                    {freelancer.firstName?.[0]}
                  </div>
                )}

                {isOnline && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-brand-navy bg-brand-green" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-semibold text-white">
                  {fullName}
                </h2>

                <p className="truncate text-xs text-white/35">
                  {freelancer.email}
                </p>
              </div>

              <Link
                href={`/profile/u/${freelancer.id}`}
                className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white/4 px-3 py-2 text-xs font-medium text-white/60 transition-colors hover:bg-brand-green hover:text-brand-navy"
              >
                View Profile
                <ArrowRightFromLine size={13} />
              </Link>
            </div>

            <p className="mt-3 line-clamp-2 text-xs leading-5 text-white/40">
              {freelancer.profile?.bio || "No bio provided yet."}
            </p>
          </article>
        );
      })}
    </div>
  );
}

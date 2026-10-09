"use client";

import TableCell from "@/app/admin/components/TableCell";
import { IService } from "@/app/types/service";
import Link from "next/link";
import { usePresenceStore } from "@/app/stores/usePresenceStore";

export default function Freelancer({ service }: { service: IService }) {
  const onlineUserIds = usePresenceStore(
    (state) => state.onlineUserIds,
  );

  const freelancerUser = service.freelancer.user;
  const isOnline = onlineUserIds.includes(freelancerUser.id);

  return (
    <TableCell>
      <div className="flex items-center gap-2.5">
        <div className="group/avatar relative h-10 w-10 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/6">
            <Link href={`/freelancer/u/${freelancerUser.id}`}>
              <img
                src={freelancerUser.profile.avatar.url}
                alt=""
                className="h-10 w-10 rounded-full object-cover transition-all duration-300 hover:scale-110"
              />
            </Link>
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

        <span className="whitespace-nowrap text-sm text-white/55">
          {freelancerUser.firstName} {freelancerUser.lastName}
        </span>
      </div>
    </TableCell>
  );
}
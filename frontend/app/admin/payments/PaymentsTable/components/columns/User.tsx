"use client";

import Link from "next/link";
import TableCell from "@/app/admin/components/TableCell";
import { IPayment } from "@/app/types/payment";
import { UserRound, ExternalLink } from "lucide-react";
import { usePresenceStore } from "@/app/stores/usePresenceStore";

export default function User({ payment }: { payment: IPayment }) {
  const user = payment.user;

  const onlineUserIds = usePresenceStore((state) => state.onlineUserIds);

  const isOnline = user ? onlineUserIds.includes(user.id) : false;

  return (
    <TableCell>
      <div className="flex items-center gap-2.5">
        <div className="group/avatar relative h-8 w-8 shrink-0">
          {user?.profile?.avatar?.url ? (
            <Link href={`/profile/u/${user.id}`}>
              <img
                src={user.profile.avatar.url}
                alt={`${user.firstName} ${user.lastName}`}
                className="h-8 w-8 rounded-full object-cover transition-all duration-300 hover:scale-110"
              />
            </Link>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/6">
              <UserRound size={13} className="text-white/35" />
            </div>
          )}

          {isOnline && (
            <>
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-brand-navy bg-brand-green shadow-[0_0_7px_rgba(0,220,130,0.45)]" />

              <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-brand-navy px-2.5 py-1.5 text-[10px] font-medium text-white opacity-0 shadow-xl transition-opacity duration-200 group-hover/avatar:opacity-100">
                Online
              </span>
            </>
          )}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white/70">
            {user?.firstName} {user?.lastName}
          </p>
        </div>
      </div>
    </TableCell>
  );
}

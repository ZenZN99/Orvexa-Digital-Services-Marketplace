"use client";

import Link from "next/link";
import VerificationBadge from "@/app/shared/components/VerificationBadge";
import { IUser, UserRole } from "@/app/types/user";
import { Briefcase, CalendarDays, Mail, User } from "lucide-react";
import { usePresenceStore } from "@/app/stores/usePresenceStore";

interface HeaderProps {
  user: IUser;
  joinedDate: string | undefined;
  roleLabel: string;
}

export default function Header({ user, joinedDate, roleLabel }: HeaderProps) {
  const isFreelancer = user.role === UserRole.FREELANCER;

  const onlineUserIds = usePresenceStore((state) => state.onlineUserIds);

  const isOnline = onlineUserIds.includes(user.id);

  return (
    <section className="overflow-hidden rounded-3xl border border-white/8 bg-brand-navy/25 shadow-2xl shadow-black/20 backdrop-blur-xl">
      {/* Cover */}
      <div className="relative h-40 overflow-hidden sm:h-48 lg:h-56">
        {user.profile.cover?.url ? (
          <img
            src={user.profile.cover.url}
            alt="Profile cover"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-brand-green/40 via-brand-navy to-brand-navy" />
        )}

        {/* Cover overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-brand-navy via-brand-navy/20 to-transparent" />
      </div>

      {/* User info */}
      <div className="relative px-4 pb-5 sm:px-6 lg:px-8">
        {/* Avatar */}
        <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="relative w-fit">
            <div className="h-24 w-24 overflow-hidden rounded-[1.35rem] border-[3px] border-brand-navy bg-brand-navy shadow-xl sm:h-28 sm:w-28">
              {user.profile.avatar?.url ? (
                <img
                  src={user.profile.avatar.url}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white/6">
                  <User size={36} className="text-white/30" />
                </div>
              )}
            </div>

            {/* Online status */}
            {isOnline && (
              <div className="group/status absolute -bottom-1 -right-1">
                <span className="block h-4 w-4 rounded-full border-[3px] border-brand-navy bg-brand-green shadow-[0_0_10px_rgba(0,220,130,0.45)]" />

                <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-brand-navy px-2.5 py-1.5 text-[11px] font-medium text-white opacity-0 shadow-xl transition-opacity duration-200 group-hover/status:opacity-100">
                  Online
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Name */}
        <div className="mt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  {user.firstName} {user.lastName}
                </h1>

                <VerificationBadge user={user} />
              </div>

              <p className="mt-1.5 text-xs text-white/45">{roleLabel}</p>
            </div>

            {isFreelancer && (
              <Link
                href={`/freelancer/u/${user.id}`}
                className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-brand-green/20 bg-brand-green/10 px-3.5 py-2 text-xs font-medium text-brand-green transition hover:border-brand-green/30 hover:bg-brand-green/20"
              >
                <Briefcase size={14} />
                Portfolio
              </Link>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/45">
          <div className="flex items-center gap-1.5">
            <Mail size={14} />
            {user.email}
          </div>

          {joinedDate && (
            <div className="flex items-center gap-1.5">
              <CalendarDays size={14} />
              Joined {joinedDate}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

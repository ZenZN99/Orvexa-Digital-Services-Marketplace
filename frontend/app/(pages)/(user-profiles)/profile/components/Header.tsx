"use client";

import Link from "next/link";
import VerificationBadge from "@/app/shared/components/VerificationBadge";
import { IUser, UserRole } from "@/app/types/user";
import {
  Briefcase,
  CalendarDays,
  Camera,
  Loader2,
  Mail,
  User,
  WalletCards,
} from "lucide-react";

interface HeaderProps {
  currentUser: IUser;
  loading: { updating: boolean };
  uploadingField: "avatar" | "cover" | null;
  avatarInputRef: React.RefObject<HTMLInputElement | null>;
  coverInputRef: React.RefObject<HTMLInputElement | null>;
  roleLabel: string;
  joinedDate: string | undefined;
}

export default function Header({
  currentUser,
  loading,
  uploadingField,
  avatarInputRef,
  coverInputRef,
  roleLabel,
  joinedDate,
}: HeaderProps) {
  const isFreelancer = currentUser.role === UserRole.FREELANCER;
  const isClient = currentUser.role === UserRole.CLIENT;

  return (
    <section className="overflow-hidden rounded-3xl border border-white/8 bg-brand-navy/25 shadow-2xl shadow-black/20 backdrop-blur-xl">
      {/* Cover */}
      <div className="relative h-40 overflow-hidden sm:h-48 lg:h-56">
        {currentUser.profile.cover ? (
          <img
            src={currentUser.profile.cover.url}
            alt="Profile cover"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-brand-green/40 via-brand-navy to-brand-navy" />
        )}

        {/* Cover overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-brand-navy via-brand-navy/20 to-transparent" />

        {/* Edit cover */}
        <button
          type="button"
          onClick={() => coverInputRef.current?.click()}
          disabled={loading.updating}
          className="absolute right-4 top-4 flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs font-medium text-white backdrop-blur-md transition hover:bg-black/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploadingField === "cover" ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Camera size={14} />
          )}
          Change cover
        </button>
      </div>

      {/* User info */}
      <div className="relative px-4 pb-5 sm:px-6 lg:px-8">
        {/* Avatar */}
        <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="relative w-fit">
            <div className="h-24 w-24 overflow-hidden rounded-[1.35rem] border-[3px] border-brand-navy bg-brand-navy shadow-xl sm:h-28 sm:w-28">
              {currentUser.profile.avatar ? (
                <img
                  src={currentUser.profile.avatar.url}
                  alt={`${currentUser.firstName} ${currentUser.lastName}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white/6">
                  <User size={36} className="text-white/30" />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={loading.updating}
              aria-label="Change profile photo"
              className="absolute bottom-1.5 right-1.5 flex h-8 w-8 items-center justify-center rounded-lg border-2 border-brand-navy bg-brand-green text-white shadow-lg transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploadingField === "avatar" ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Camera size={14} />
              )}
            </button>
          </div>
        </div>

        {/* Name */}
        <div className="mt-4">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                {currentUser.firstName} {currentUser.lastName}
              </h1>

              <VerificationBadge user={currentUser} />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {isFreelancer && (
                <Link
                  href="/freelancer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-brand-green/20 bg-brand-green/10 px-3 py-1.5 text-xs font-medium text-brand-green transition hover:bg-brand-green/20"
                >
                  <Briefcase size={14} />
                  My Portfolio
                </Link>
              )}

              {isClient && (
                <Link
                  href="/orders"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-brand-green/20 bg-brand-green/10 px-3 py-1.5 text-xs font-medium text-brand-green transition hover:bg-brand-green/20"
                >
                  <Briefcase size={14} />
                  My Orders
                </Link>
              )}

              <Link
                href="/wallent"
                className="inline-flex items-center gap-1.5 rounded-lg border border-brand-green/20 bg-brand-green/10 px-3 py-1.5 text-xs font-medium text-brand-green transition hover:bg-brand-green/20"
              >
                <WalletCards size={14} />
                My Balance
              </Link>
            </div>
          </div>

          <p className="mt-1.5 text-xs text-white/45">{roleLabel}</p>
        </div>

        {/* Meta */}
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/45">
          <div className="flex items-center gap-1.5">
            <Mail size={14} />
            {currentUser.email}
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

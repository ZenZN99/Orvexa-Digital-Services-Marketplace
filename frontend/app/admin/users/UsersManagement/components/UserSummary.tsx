"use client";
import Link from "next/link";
import { IUser } from "@/app/types/user";
import {  UserRound, X } from "lucide-react";
import InfoCard from "./InfoCard";
import { formatRole } from "../utils/formatRole";

interface UserSummaryProps {
  user: IUser;
  onClose: () => void;
}

export default function UserSummary({ user, onClose }: UserSummaryProps) {
  return (
    <div className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
            <Link href={`/profile/u/${user.id}`}>
              <img
                src={user.profile.avatar.url}
                alt=""
                className="rounded-full w-10 h-10 object-cover transition-all duration-300 hover:scale-110"
              />
            </Link>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              {user.firstName} {user.lastName}
            </h3>

            <p className="mt-1 text-xs text-white/30">{user.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/25 hover:bg-white/5 hover:text-white/60"
          aria-label="Close details"
        >
          <X size={15} />
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <InfoCard label="Role" value={formatRole(user.role)} />

        <InfoCard
          label="Account"
          value={user.isActive ? "Active" : "Blocked"}
        />

        <InfoCard label="Balance" value={`$${user.balance.toLocaleString()}`} />

        <InfoCard
          label="Frozen"
          value={`$${user.frozenBalance.toLocaleString()}`}
        />
      </div>

      <div className="mt-4 rounded-xl border border-white/6 bg-white/2 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/20">
          Bio
        </p>

        <p className="mt-2 text-sm leading-6 text-white/45">
          {user.profile?.bio || "No bio provided."}
        </p>
      </div>
    </div>
  );
}

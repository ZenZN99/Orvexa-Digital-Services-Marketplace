"use client";

import { IUser, UserRole } from "@/app/types/user";
import { User } from "lucide-react";

interface RoleProps {
  currentUser: IUser;
  roleLabel: string;
}

export default function Role({ currentUser, roleLabel }: RoleProps) {
  return (
    <section className="rounded-3xl border border-white/8 bg-brand-navy/25 p-5 backdrop-blur-xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/30">
        Account type
      </p>

      <div className="mt-3.5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green">
          <User size={17} />
        </div>

        <div>
          <p className="text-xs font-semibold text-white">{roleLabel}</p>
          <p className="mt-1 text-[11px] text-white/40">
            {currentUser.role === UserRole.FREELANCER
              ? "You can offer services on Orvexa."
              : currentUser.role === UserRole.CLIENT
                ? "You can discover and purchase services."
                : currentUser.role === UserRole.ADMIN
                  ? "You have full administrative access."
                  : "You manage support conversations."}
          </p>
        </div>
      </div>
    </section>
  );
}

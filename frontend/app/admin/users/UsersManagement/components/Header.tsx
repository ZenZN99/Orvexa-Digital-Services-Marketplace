"use client";

import { Users } from "lucide-react";

export default function Header() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-green/10">
          <Users size={17} className="text-brand-green" />
        </div>

        <span className="text-xs font-medium uppercase tracking-[0.14em] text-brand-green">
          User Administration
        </span>
      </div>

      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
        Users Management
      </h2>

      <p className="mt-1 max-w-2xl text-sm leading-6 text-white/35">
        Manage users, roles, account status and identity verification.
      </p>
    </div>
  );
}

"use client";

import { IUser } from "@/app/types/user";
import { ShieldCheck } from "lucide-react";

export default function Account({user} : {user: IUser}) {
  return (
    <section className="rounded-3xl border border-white/8 bg-brand-navy/25 p-5 backdrop-blur-xl">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green">
          <ShieldCheck size={16} />
        </div>

        <div>
          <h3 className="text-xs font-semibold">Account status</h3>
          <p className="mt-0.5 text-[11px] text-white/40">Orvexa account</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-brand-green/10 bg-brand-green/5 p-3.5">
        <div className="flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              user.isActive
                ? "bg-brand-green shadow-[0_0_10px_rgba(0,220,130,0.7)]"
                : "bg-white/20"
            }`}
          />
          <span className="text-xs font-medium text-white">
            {user.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <p className="mt-1.5 text-[11px] leading-5 text-white/40">
          {user.isActive
            ? "This account is active on Orvexa."
            : "This account is currently inactive."}
        </p>
      </div>
    </section>
  );
}

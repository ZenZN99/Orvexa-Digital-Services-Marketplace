"use client";

import { IUser } from "@/app/types/user";

export default function Bio({ user }: { user: IUser }) {
  return (
    <section className="rounded-3xl border border-white/8 bg-brand-navy/25 p-5 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-green">
          About
        </p>

        <h2 className="mt-1.5 text-lg font-semibold">Introduction</h2>
      </div>

      <div className="mt-5">
        {user.profile.bio ? (
          <p className="max-w-3xl text-sm leading-6 text-white/60">
            {user.profile.bio}
          </p>
        ) : (
          <div className="rounded-xl border border-dashed border-white/10 bg-white/2 p-5 text-center">
            <p className="text-xs text-white/40">
              This user hasn&apos;t added a bio yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

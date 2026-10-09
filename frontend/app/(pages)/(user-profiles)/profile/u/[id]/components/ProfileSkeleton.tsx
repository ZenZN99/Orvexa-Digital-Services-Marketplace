"use client";

export default function Loading() {
  return (
    <main className="min-h-screen bg-brand-navy pt-20 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 lg:px-12">
        {/* Profile Header Skeleton */}
        <div className="overflow-hidden rounded-3xl border border-white/[0.07] bg-white/15">
          {/* Cover */}
          <div className="h-44 animate-pulse bg-white/[0.035] sm:h-56" />

          <div className="relative px-6 pb-8 sm:px-8">
            {/* Avatar */}
            <div className="-mt-12 h-24 w-24 animate-pulse rounded-2xl border-4 border-brand-navy bg-white/[0.07] sm:h-28 sm:w-28" />

            {/* User info */}
            <div className="mt-5 space-y-3">
              <div className="h-6 w-48 animate-pulse rounded-lg bg-white/[0.07]" />

              <div className="h-4 w-64 animate-pulse rounded-lg bg-white/5" />

              <div className="flex gap-3 pt-2">
                <div className="h-8 w-24 animate-pulse rounded-lg bg-white/5" />
                <div className="h-8 w-20 animate-pulse rounded-lg bg-white/5" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* About */}
          <section className="rounded-3xl border border-white/[0.07] bg-white/15 p-6 sm:p-8">
            <div className="h-5 w-24 animate-pulse rounded-lg bg-white/[0.07]" />

            <div className="mt-6 space-y-3">
              <div className="h-4 w-full animate-pulse rounded-lg bg-white/5" />
              <div className="h-4 w-[92%] animate-pulse rounded-lg bg-white/5" />
              <div className="h-4 w-[68%] animate-pulse rounded-lg bg-white/5" />
            </div>
          </section>

          {/* Sidebar */}
          <aside className="rounded-3xl border border-white/[0.07] bg-white/15 p-6">
            <div className="h-5 w-28 animate-pulse rounded-lg bg-white/[0.07]" />

            <div className="mt-6 space-y-4">
              <div className="h-12 animate-pulse rounded-xl bg-white/4" />
              <div className="h-12 animate-pulse rounded-xl bg-white/4" />
              <div className="h-12 animate-pulse rounded-xl bg-white/4" />
            </div>
          </aside>
        </div>

        {/* Bottom indicator */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-white/25">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-green" />
          Preparing profile
        </div>
      </div>
    </main>
  );
}

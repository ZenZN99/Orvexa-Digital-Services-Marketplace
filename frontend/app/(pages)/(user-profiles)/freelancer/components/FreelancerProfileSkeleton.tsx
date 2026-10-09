"use client";

import Background from "./Background";

function Bone({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-white/6 ${className}`} />;
}

function SidebarRow() {
  return (
    <div className="flex gap-4">
      <Bone className="h-10 w-10 shrink-0 rounded-xl" />

      <div className="flex-1">
        <Bone className="h-3 w-16 rounded-md" />
        <Bone className="mt-2 h-4 w-36 rounded-md" />
      </div>
    </div>
  );
}

export default function FreelancerProfileSkeleton() {
  return (
    <main
      className="min-h-screen bg-brand-navy pb-24 text-white"
      aria-busy="true"
      aria-label="Loading profile"
    >
      <Background />

      <div className="relative mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* ========== HEADER ========== */}
        <section className="overflow-hidden rounded-4xl border border-white/8 bg-white/2.5 shadow-2xl shadow-black/20 backdrop-blur-xl">
          {/* Cover */}
          <Bone className="h-56 w-full sm:h-64 lg:h-72" />

          <div className="relative flex flex-col items-center px-5 pb-8">
            {/* Avatar */}
            <div className="relative -mt-20">
              <div className="h-40 w-40 overflow-hidden rounded-4xl border-[5px] border-brand-navy bg-brand-navy shadow-2xl shadow-black/30">
                <Bone className="h-full w-full" />
              </div>
            </div>

            {/* Name */}
            <Bone className="mt-5 h-8 w-56 rounded-xl sm:h-9 sm:w-72" />

            {/* Job title */}
            <Bone className="mt-3 h-4 w-40 rounded-md" />

            {/* Rating */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Bone key={i} className="h-3.75 w-3.75 rounded-sm" />
                ))}
              </div>
              <Bone className="h-4 w-24 rounded-md" />
            </div>

            {/* Quick stats */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-8">
                  <div className="flex flex-col items-center">
                    <Bone className="h-6 w-10 rounded-md" />
                    <Bone className="mt-2 h-3 w-24 rounded-md" />
                  </div>

                  {i < 2 && <div className="h-8 w-px bg-white/8" />}
                </div>
              ))}
            </div>

            {/* Edit controls */}
            <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Bone className="h-11 w-full rounded-xl sm:w-36" />
              <Bone className="h-11 w-full rounded-xl sm:w-40" />
            </div>
          </div>
        </section>

        {/* ========== TABS ========== */}
        <div className="mt-6 flex justify-center">
          <div className="inline-flex rounded-2xl border border-white/8 bg-white/2.5 p-1.5 backdrop-blur-xl">
            {[0, 1, 2].map((i) => (
              <div key={i} className="px-2 py-1 sm:px-3">
                <Bone className="h-6 w-16 rounded-lg sm:w-20" />
              </div>
            ))}
          </div>
        </div>

        {/* ========== OVERVIEW ========== */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          <section className="space-y-6">
            {/* About */}
            <div className="rounded-4xl border border-white/8 bg-white/2.5 p-6 backdrop-blur-xl sm:p-8">
              <Bone className="h-3 w-14 rounded-md" />
              <Bone className="mt-3 h-6 w-48 rounded-lg" />

              <div className="mt-6 space-y-3">
                <Bone className="h-4 w-full rounded-md" />
                <Bone className="h-4 w-full rounded-md" />
                <Bone className="h-4 w-11/12 rounded-md" />
                <Bone className="h-4 w-4/5 rounded-md" />
                <Bone className="h-4 w-2/3 rounded-md" />
              </div>
            </div>

            {/* Skills */}
            <div className="rounded-4xl border border-white/8 bg-white/2.5 p-6 backdrop-blur-xl sm:p-8">
              <Bone className="h-3 w-20 rounded-md" />
              <Bone className="mt-3 h-6 w-60 rounded-lg" />

              <div className="mt-6 flex flex-wrap gap-2.5">
                {[
                  "w-24",
                  "w-32",
                  "w-20",
                  "w-28",
                  "w-36",
                  "w-24",
                  "w-30",
                  "w-22",
                ].map((width, i) => (
                  <Bone key={i} className={`h-9.5 rounded-xl ${width}`} />
                ))}
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <aside>
            <div className="rounded-4xl border border-white/8 bg-white/2.5 p-6 backdrop-blur-xl">
              <Bone className="h-3 w-40 rounded-md" />

              <div className="mt-6 space-y-5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <SidebarRow key={i} />
                ))}
              </div>

              <Bone className="mt-7 h-12 w-full rounded-xl" />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

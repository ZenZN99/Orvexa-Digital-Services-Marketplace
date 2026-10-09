"use client";

const ROWS = 4;
const FILTERS = ["w-10", "w-20", "w-16", "w-24", "w-20"];

function Bone({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-white/6 ${className}`} />;
}

export default function Skeleton() {
  return (
    <main
      className="min-h-screen bg-brand-navy px-4 py-24 text-white sm:px-6 lg:px-8"
      aria-busy="true"
      aria-label="Loading contracts"
    >
      <div className="mx-auto max-w-7xl">
        {/* ========== HEADER ========== */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Bone className="h-4.5 w-4.5 rounded-md" />
              <Bone className="h-3 w-20 rounded-md" />
            </div>

            <Bone className="mt-3 h-7 w-44 rounded-md sm:h-8 sm:w-52" />

            <div className="mt-3 max-w-xl space-y-2">
              <Bone className="h-3.5 w-full rounded-md" />
              <Bone className="h-3.5 w-2/3 rounded-md" />
            </div>
          </div>
        </div>

        {/* ========== STATS ========== */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/8 bg-white/3 p-5"
            >
              <Bone className="h-3 w-24 rounded-md" />
              <Bone className="mt-3 h-7 w-16 rounded-md" />
              <Bone className="mt-2 h-3 w-28 rounded-md" />
            </div>
          ))}
        </div>

        {/* ========== CONTRACT HISTORY ========== */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-white/8 bg-white/3">
          {/* Title */}
          <div className="border-b border-white/6 px-5 py-4 sm:px-6">
            <Bone className="h-4 w-32 rounded-md" />
            <Bone className="mt-2 h-3 w-56 max-w-full rounded-md" />
          </div>

          {/* Search + Filters */}
          <div className="border-b border-white/6 px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <Bone className="h-10 w-full rounded-xl lg:max-w-sm" />

              <div className="flex flex-wrap items-center gap-2">
                {FILTERS.map((width, i) => (
                  <Bone key={i} className={`h-8 ${width} rounded-lg`} />
                ))}
              </div>
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/6">
            {Array.from({ length: ROWS }).map((_, i) => (
              <div key={i} className="px-5 py-5 sm:px-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  {/* Main */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <Bone className="h-4 w-48 max-w-full rounded-md" />
                      <Bone className="h-6 w-24 rounded-lg" />
                    </div>

                    <div className="mt-3 flex items-center gap-1.5">
                      <Bone className="h-3.25 w-3.25 rounded-sm" />
                      <Bone className="h-3 w-36 rounded-md" />
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex items-center justify-between gap-6 lg:justify-end">
                    <div>
                      <Bone className="h-3 w-12 rounded-md" />
                      <Bone className="mt-2 h-4 w-16 rounded-md" />
                    </div>

                    <div>
                      <Bone className="h-3 w-12 rounded-md" />
                      <Bone className="mt-2 h-4 w-14 rounded-md" />
                    </div>

                    <Bone className="h-9 w-20 shrink-0 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

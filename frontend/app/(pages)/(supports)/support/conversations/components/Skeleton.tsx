"use client";

const ROWS = 4;

function Bone({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-white/6 ${className}`} />;
}

export default function Skeleton() {
  return (
    <main
      className="min-h-screen bg-brand-navy px-5 pb-20 pt-28 text-white sm:px-8 sm:pt-32"
      aria-busy="true"
      aria-label="Loading conversations"
    >
      <div className="mx-auto max-w-3xl">
        {/* ========== HEADER ========== */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Bone className="h-11 w-11 shrink-0 rounded-xl" />

            <div>
              <Bone className="h-5 w-24 rounded-md" />
              <Bone className="mt-2.5 h-3.5 w-32 rounded-md" />
            </div>
          </div>

          {/* New conversation button */}
          <Bone className="h-10 w-44 rounded-xl" />
        </div>

        {/* ========== STATS ========== */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex flex-col items-center rounded-xl border border-white/8 bg-white/2.5 p-3"
            >
              <Bone className="h-6 w-8 rounded-md" />
              <Bone className="mt-2 h-3 w-10 rounded-md" />
            </div>
          ))}
        </div>

        {/* ========== TOOLBAR ========== */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <Bone className="h-10.5 min-w-50 flex-1 rounded-lg" />

          <div className="flex gap-1.5">
            <Bone className="h-8.5 w-12 rounded-lg" />
            <Bone className="h-8.5 w-14 rounded-lg" />
            <Bone className="h-8.5 w-16 rounded-lg" />
          </div>
        </div>

        {/* ========== LIST ========== */}
        <div className="space-y-3">
          {Array.from({ length: ROWS }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/8 bg-white/2.5 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <Bone className="h-10 w-10 shrink-0 rounded-full" />

                  <div>
                    <Bone className="h-3.5 w-32 rounded-md" />
                    <Bone className="mt-2 h-3 w-40 rounded-md" />
                  </div>
                </div>

                <Bone className="h-6 w-16 shrink-0 rounded-full" />
              </div>

              {/* Last message */}
              <div className="mt-4 space-y-2 rounded-xl border border-white/6 bg-white/2 p-3">
                <Bone className="h-3.5 w-full rounded-md" />
                <Bone className="h-3.5 w-2/3 rounded-md" />
              </div>

              {/* Updated */}
              <Bone className="mt-3 h-3 w-36 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

"use client";

const ROWS = 6;

function Bone({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-white/6 ${className}`} />;
}

export default function Skeleton() {
  return (
    <main
      className="min-h-screen bg-brand-navy px-5 py-28 text-white sm:px-8"
      aria-busy="true"
      aria-label="Loading payments"
    >
      <div className="mx-auto max-w-6xl">
        {/* ========== HEADER ========== */}
        <div className="flex items-center gap-3">
          <Bone className="h-10 w-10 shrink-0 rounded-xl" />

          <div>
            <Bone className="h-6 w-28 rounded-md" />
            <Bone className="mt-2 h-3.5 w-60 max-w-full rounded-md" />
          </div>
        </div>

        {/* ========== STATS ========== */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/8 bg-white/3 p-5"
            >
              <div className="flex items-center justify-between">
                <Bone className="h-9 w-9 rounded-xl" />
                <Bone className="h-3 w-16 rounded-md" />
              </div>

              <Bone className="mt-5 h-8 w-28 rounded-md" />
              <Bone className="mt-2 h-3 w-24 rounded-md" />
            </div>
          ))}
        </div>

        {/* ========== HISTORY ========== */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-white/8 bg-white/3">
          {/* Section header */}
          <div className="flex items-center justify-between border-b border-white/6 px-5 py-4 sm:px-6">
            <div>
              <Bone className="h-4 w-32 rounded-md" />
              <Bone className="mt-2 h-3 w-36 rounded-md" />
            </div>

            <Bone className="h-6.5 w-24 rounded-lg" />
          </div>

          {/* Desktop table */}
          <div className="hidden md:block">
            <div className="grid grid-cols-4 border-b border-white/6 px-6 py-3">
              {["w-14", "w-12", "w-10", "w-14"].map((width, i) => (
                <Bone
                  key={i}
                  className={`h-3 rounded-md ${width} ${
                    i === 3 ? "ml-auto" : ""
                  }`}
                />
              ))}
            </div>

            {Array.from({ length: ROWS }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-4 items-center border-b border-white/5 px-6 py-4 last:border-0"
              >
                <Bone className="h-4 w-16 rounded-md" />
                <Bone className="h-6 w-24 rounded-full" />
                <Bone className="h-4 w-28 rounded-md" />

                <div className="flex justify-end gap-2">
                  <Bone className="h-8 w-22 rounded-lg" />
                  <Bone className="h-8 w-18 rounded-lg" />
                </div>
              </div>
            ))}
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-white/5 md:hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Bone className="h-10 w-10 shrink-0 rounded-xl" />

                    <div>
                      <Bone className="h-4 w-32 rounded-md" />
                      <Bone className="mt-2 h-3 w-24 rounded-md" />
                    </div>
                  </div>

                  <Bone className="h-6 w-20 shrink-0 rounded-full" />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div>
                    <Bone className="h-3 w-12 rounded-md" />
                    <Bone className="mt-2 h-6 w-20 rounded-md" />
                  </div>

                  <div>
                    <Bone className="h-3 w-10 rounded-md" />
                    <Bone className="mt-2 h-4 w-28 rounded-md" />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <Bone className="h-10 rounded-xl" />
                  <Bone className="h-10 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

"use client";

const ORDERS = [2, 1, 2];

function Bone({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-white/6 ${className}`} />;
}

export default function Skeleton() {
  return (
    <main
      className="min-h-screen bg-brand-navy px-6 py-28 text-white"
      aria-busy="true"
      aria-label="Loading orders"
    >
      <div className="mx-auto max-w-6xl">
        {/* ========== HEADER ========== */}
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <Bone className="h-11 w-11 shrink-0 rounded-xl" />

            <div>
              <Bone className="h-7 w-36 rounded-md" />
              <Bone className="mt-2.5 h-3.5 w-48 rounded-md" />
            </div>
          </div>

          <div className="mt-6 h-px bg-white/8" />
        </div>

        {/* ========== ORDERS ========== */}
        <div className="space-y-4">
          {ORDERS.map((servicesCount, orderIndex) => (
            <div
              key={orderIndex}
              className="rounded-2xl border border-white/8 bg-white/2.5 p-5"
            >
              {/* Top */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Bone className="h-4 w-14 rounded-md" />
                    <Bone className="h-6 w-24 rounded-full" />
                  </div>

                  <Bone className="mt-3 h-3 w-32 rounded-md" />
                </div>

                <div className="flex flex-col items-start sm:items-end">
                  <Bone className="h-3 w-10 rounded-md" />
                  <Bone className="mt-2 h-6 w-20 rounded-md" />
                </div>
              </div>

              {/* Services */}
              <div className="mt-5 space-y-2">
                {Array.from({ length: servicesCount }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/2 px-4 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Bone className="h-14 w-20 shrink-0 rounded-lg" />

                      <div>
                        <Bone className="h-4 w-44 max-w-full rounded-md" />
                        <Bone className="mt-2 h-3 w-28 rounded-md" />
                      </div>
                    </div>

                    <Bone className="h-4 w-14 shrink-0 rounded-md" />
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-5 flex justify-end gap-2 border-t border-white/6 pt-4">
                <Bone className="h-9.5 w-24 rounded-xl" />
                <Bone className="h-9.5 w-28 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

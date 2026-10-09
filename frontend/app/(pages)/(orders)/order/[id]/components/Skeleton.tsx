"use client";

const SERVICES = 2;

function Bone({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-white/6 ${className}`} />;
}

export default function Skeleton() {
  return (
    <main
      className="min-h-screen bg-brand-navy px-5 py-28 text-white sm:px-8"
      aria-busy="true"
      aria-label="Loading order"
    >
      <div className="mx-auto max-w-6xl">
        {/* ========== BACK ========== */}
        <Bone className="mb-8 h-4 w-32 rounded-md" />

        {/* ========== HEADER ========== */}
        <section className="rounded-2xl border border-white/8 bg-white/2.5 p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Bone className="h-11 w-11 shrink-0 rounded-xl" />

                <div>
                  <Bone className="h-3 w-12 rounded-md" />
                  <Bone className="mt-2 h-7 w-72 max-w-full rounded-md" />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-5">
                <Bone className="h-3.5 w-40 rounded-md" />
                <Bone className="h-3.5 w-40 rounded-md" />
              </div>
            </div>

            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
              <Bone className="h-7 w-28 rounded-full" />

              <div className="sm:ml-4 sm:border-l sm:border-white/8 sm:pl-6">
                <Bone className="h-3 w-16 rounded-md" />
                <Bone className="mt-2 h-7 w-24 rounded-md" />
              </div>
            </div>
          </div>
        </section>

        {/* ========== CONTENT ========== */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* ----- ORDER ITEMS ----- */}
          <section>
            <div className="mb-5">
              <Bone className="h-6 w-32 rounded-md" />
              <Bone className="mt-2 h-3 w-40 rounded-md" />
            </div>

            <div className="space-y-5">
              {Array.from({ length: SERVICES }).map((_, i) => (
                <article
                  key={i}
                  className="overflow-hidden rounded-2xl border border-white/8 bg-white/2.5"
                >
                  {/* Image */}
                  <Bone className="aspect-[2.4/1] w-full sm:aspect-3/1" />

                  {/* Info */}
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <Bone className="h-6 w-3/4 rounded-md" />

                        <div className="mt-3 max-w-2xl space-y-2">
                          <Bone className="h-3.5 w-full rounded-md" />
                          <Bone className="h-3.5 w-2/3 rounded-md" />
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col sm:items-end">
                        <Bone className="h-3 w-10 rounded-md" />
                        <Bone className="mt-2 h-6 w-20 rounded-md" />
                      </div>
                    </div>

                    {/* Delivery */}
                    <div className="mt-5 flex items-center gap-2 border-t border-white/6 pt-4">
                      <Bone className="h-3.5 w-3.5 rounded-full" />
                      <Bone className="h-3 w-36 rounded-md" />
                    </div>

                    {/* Freelancer */}
                    <div className="mt-5 flex items-center justify-between rounded-xl border border-white/6 bg-white/2 p-3">
                      <div className="flex items-center gap-3">
                        <Bone className="h-10 w-10 shrink-0 rounded-full" />

                        <div>
                          <Bone className="h-2.5 w-16 rounded-md" />
                          <Bone className="mt-2 h-4 w-32 rounded-md" />
                        </div>
                      </div>

                      <Bone className="h-9 w-9 shrink-0 rounded-lg" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ----- SIDEBAR ----- */}
          <div className="space-y-4">
            {/* Summary */}
            <div className="rounded-2xl border border-white/8 bg-white/2.5 p-5">
              <Bone className="h-5 w-32 rounded-md" />

              <div className="mt-5 space-y-3">
                {[0, 1].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Bone className="h-4 w-16 rounded-md" />
                    <Bone className="h-4 w-12 rounded-md" />
                  </div>
                ))}

                <div className="h-px bg-white/7" />

                <div className="flex items-center justify-between">
                  <Bone className="h-5 w-12 rounded-md" />
                  <Bone className="h-6 w-20 rounded-md" />
                </div>
              </div>

              {/* Status */}
              <div className="mt-6 rounded-xl border border-white/6 bg-white/2 p-4">
                <div className="flex items-start gap-3">
                  <Bone className="mt-0.5 h-4.25 w-4.25 shrink-0 rounded-full" />

                  <div className="flex-1">
                    <Bone className="h-4 w-24 rounded-md" />

                    <div className="mt-2 space-y-2">
                      <Bone className="h-3 w-full rounded-md" />
                      <Bone className="h-3 w-3/4 rounded-md" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-2xl border border-white/8 bg-white/2.5 p-5">
              <div className="flex items-start gap-3">
                <Bone className="h-10 w-10 shrink-0 rounded-xl" />

                <div className="flex-1">
                  <Bone className="h-4 w-28 rounded-md" />

                  <div className="mt-2 space-y-2">
                    <Bone className="h-3 w-full rounded-md" />
                    <Bone className="h-3 w-2/3 rounded-md" />
                  </div>
                </div>
              </div>

              <Bone className="mt-5 h-11 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

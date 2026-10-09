"use client";

function Bone({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-white/6 ${className}`} />;
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-brand-navy/40 p-5 backdrop-blur-xl">
      {children}
    </div>
  );
}

export default function Skeleton() {
  return (
    <main
      className="min-h-screen bg-brand-navy pb-24 pt-20 text-white"
      aria-busy="true"
      aria-label="Loading service"
    >
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8">
        {/* ========== HEADER ========== */}
        <div className="mb-8 flex items-center gap-3">
          <Bone className="h-11 w-11 shrink-0 rounded-xl" />

          <div>
            <Bone className="h-6 w-36 rounded-md" />
            <Bone className="mt-2.5 h-3.5 w-80 max-w-full rounded-md" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* ========== LEFT: FORM ========== */}
          <div className="space-y-5">
            {/* Category */}
            <Card>
              <Bone className="h-4 w-20 rounded-md" />

              <div className="mt-4 flex flex-wrap gap-2">
                {["w-24", "w-20", "w-28", "w-16", "w-24", "w-20"].map(
                  (width, i) => (
                    <Bone key={i} className={`h-7.5 rounded-lg ${width}`} />
                  ),
                )}
              </div>
            </Card>

            {/* Title + Description */}
            <Card>
              <div className="space-y-4">
                <div>
                  <Bone className="h-4 w-56 rounded-md" />
                  <Bone className="mt-2 h-10.5 w-full rounded-lg" />
                </div>

                <div>
                  <Bone className="h-4 w-64 rounded-md" />
                  <Bone className="mt-2 h-31.5 w-full rounded-lg" />
                </div>
              </div>
            </Card>

            {/* Features */}
            <Card>
              <Bone className="h-4 w-28 rounded-md" />
              <Bone className="mt-2.5 h-3 w-72 max-w-full rounded-md" />

              <div className="mt-4 flex gap-2">
                <Bone className="h-10.5 flex-1 rounded-lg" />
                <Bone className="h-10.5 w-18 rounded-lg" />
              </div>

              <div className="mt-3 space-y-2">
                <Bone className="h-9.5 w-full rounded-lg" />
                <Bone className="h-9.5 w-full rounded-lg" />
              </div>
            </Card>

            {/* Keywords */}
            <Card>
              <Bone className="h-4 w-32 rounded-md" />
              <Bone className="mt-2.5 h-3 w-72 max-w-full rounded-md" />

              <div className="mt-4 flex gap-2">
                <Bone className="h-10.5 flex-1 rounded-lg" />
                <Bone className="h-10.5 w-18 rounded-lg" />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {["w-16", "w-20", "w-14", "w-18"].map((width, i) => (
                  <Bone key={i} className={`h-7 rounded-lg ${width}`} />
                ))}
              </div>
            </Card>

            {/* Price + Delivery */}
            <div className="grid grid-cols-2 gap-4 rounded-2xl border border-white/8 bg-brand-navy/40 p-5 backdrop-blur-xl">
              {[0, 1].map((i) => (
                <div key={i}>
                  <Bone className="h-4 w-24 rounded-md" />
                  <Bone className="mt-2 h-10.5 w-full rounded-lg" />
                </div>
              ))}
            </div>

            {/* Images */}
            <Card>
              <Bone className="h-4 w-24 rounded-md" />
              <Bone className="mt-2.5 h-3 w-full max-w-md rounded-md" />

              <div className="mt-4 flex flex-wrap gap-3">
                {[0, 1, 2].map((i) => (
                  <Bone key={i} className="h-20 w-20 rounded-lg" />
                ))}
              </div>
            </Card>

            {/* Save button */}
            <Bone className="h-11.5 w-full rounded-xl" />
          </div>

          {/* ========== RIGHT: PREVIEW ========== */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <Bone className="mb-3 h-3.5 w-16 rounded-md" />

            <div className="overflow-hidden rounded-2xl border border-white/8 bg-brand-navy/40 backdrop-blur-xl">
              <Bone className="h-40 w-full" />

              <div className="space-y-3 p-4">
                <Bone className="h-5 w-20 rounded-md" />
                <Bone className="h-4 w-3/4 rounded-md" />

                <div className="space-y-2">
                  <Bone className="h-3 w-full rounded-md" />
                  <Bone className="h-3 w-full rounded-md" />
                  <Bone className="h-3 w-2/3 rounded-md" />
                </div>

                <div className="flex items-center justify-between border-t border-white/[0.07] pt-3">
                  <Bone className="h-3.5 w-28 rounded-md" />
                  <Bone className="h-4 w-12 rounded-md" />
                </div>
              </div>
            </div>

            <Bone className="mx-auto mt-3 h-3 w-40 rounded-md" />
          </div>
        </div>
      </div>
    </main>
  );
}

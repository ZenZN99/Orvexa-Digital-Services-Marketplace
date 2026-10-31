"use client";

function Bone({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-white/6 ${className}`} />;
}

export default function Skeleton() {
  return (
    <main
      className="min-h-screen bg-brand-navy pt-20 text-white"
      aria-busy="true"
      aria-label="Loading service"
    >
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* ========== BREADCRUMB ========== */}
        <div className="mb-8 flex items-center gap-2">
          <Bone className="h-4 w-16 rounded-md" />
          <span className="text-white/20">/</span>
          <Bone className="h-4 w-24 rounded-md" />
          <span className="text-white/20">/</span>
          <Bone className="h-4 w-40 rounded-md" />
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          {/* ========== LEFT: IMAGES + SELLER ========== */}
          <section>
            {/* Main image */}
            <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/3">
              <Bone className="h-125 w-full" />
            </div>

            {/* Thumbnails */}
            <div className="mt-4 grid grid-cols-5 gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Bone key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>

            {/* Seller */}
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/8 bg-white/3 p-4">
              <Bone className="h-12 w-12 shrink-0 rounded-full" />

              <div>
                <Bone className="h-3 w-16 rounded-md" />
                <Bone className="mt-2 h-4 w-32 rounded-md" />
              </div>
            </div>
          </section>

          {/* ========== RIGHT: DETAILS ========== */}
          <section>
            {/* Category + orders */}
            <div className="mb-4 flex items-center gap-3">
              <Bone className="h-7 w-24 rounded-full" />
              <Bone className="h-4 w-20 rounded-md" />
            </div>

            {/* Title */}
            <div className="space-y-3">
              <Bone className="h-8 w-full rounded-lg" />
              <Bone className="h-8 w-2/3 rounded-lg" />
            </div>

            {/* Rating */}
            <div className="mt-5 flex items-center gap-3">
              <Bone className="h-6 w-14 rounded-md" />
              <Bone className="h-4 w-10 rounded-md" />
            </div>

            <div className="my-7 h-px bg-white/8" />

            {/* Description */}
            <Bone className="h-5 w-40 rounded-md" />

            <div className="mt-4 space-y-2.5">
              <Bone className="h-4 w-full rounded-md" />
              <Bone className="h-4 w-full rounded-md" />
              <Bone className="h-4 w-11/12 rounded-md" />
              <Bone className="h-4 w-3/4 rounded-md" />
            </div>

            {/* Features */}
            <div className="mt-7">
              <Bone className="h-5 w-44 rounded-md" />

              <div className="mt-4 space-y-3">
                {["w-3/4", "w-2/3", "w-4/5", "w-1/2"].map((width, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Bone className="h-5 w-5 shrink-0 rounded-full" />
                    <Bone className={`h-4 rounded-md ${width}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div className="mt-7 flex flex-wrap gap-2">
              {["w-16", "w-20", "w-14", "w-24", "w-16"].map((width, i) => (
                <Bone key={i} className={`h-8 rounded-lg ${width}`} />
              ))}
            </div>

            {/* Purchase card */}
            <div className="mt-8 rounded-2xl border border-white/8 bg-white/3 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Bone className="h-3.5 w-20 rounded-md" />
                  <Bone className="mt-2.5 h-8 w-24 rounded-lg" />
                </div>

                <div className="flex flex-col items-end">
                  <Bone className="h-3.5 w-14 rounded-md" />
                  <Bone className="mt-2.5 h-5 w-16 rounded-md" />
                </div>
              </div>

              <Bone className="mt-6 h-12.5 w-full rounded-xl" />
            </div>
          </section>
        </div>

        {/* ========== REVIEWS ========== */}
        <section className="mt-16 border-t border-white/8 pt-12">
          <div className="flex items-end justify-between">
            <div>
              <Bone className="h-7 w-44 rounded-lg" />
              <Bone className="mt-3 h-4 w-64 max-w-full rounded-md" />
            </div>

            <div className="flex flex-col items-end">
              <Bone className="h-7 w-16 rounded-md" />
              <Bone className="mt-2 h-3.5 w-20 rounded-md" />
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Bone
                key={i}
                className="h-24 rounded-2xl border border-white/8"
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

"use client";

const ITEMS = 3;

function Bone({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-white/6 ${className}`} />;
}

export default function Skeleton() {
  return (
    <main
      className="min-h-screen bg-brand-navy px-6 py-28"
      aria-busy="true"
      aria-label="Loading cart"
    >
      <div className="mx-auto max-w-6xl">
        {/* ========== HEADER ========== */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Bone className="h-6 w-6 shrink-0 rounded-md" />
              <Bone className="h-8 w-40 rounded-md" />
            </div>

            <Bone className="mt-3 h-3.5 w-44 rounded-md" />
          </div>

          <Bone className="h-4 w-20 rounded-md" />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* ========== ITEMS ========== */}
          <div className="space-y-4">
            {Array.from({ length: ITEMS }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-5 rounded-2xl border border-white/8 bg-white/2.5 p-4 sm:flex-row"
              >
                {/* Image */}
                <Bone className="h-44 w-full shrink-0 rounded-xl sm:h-32 sm:w-44" />

                <div className="min-w-0 flex-1">
                  {/* Category */}
                  <Bone className="h-3 w-20 rounded-md" />

                  {/* Title */}
                  <div className="mt-2.5 space-y-2">
                    <Bone className="h-4 w-full rounded-md" />
                    <Bone className="h-4 w-2/3 rounded-md" />
                  </div>

                  {/* Meta */}
                  <div className="mt-3 flex items-center gap-4">
                    <Bone className="h-3 w-28 rounded-md" />
                    <Bone className="h-3 w-12 rounded-md" />
                  </div>

                  {/* Price + Remove */}
                  <div className="mt-4 flex items-center justify-between">
                    <Bone className="h-6 w-16 rounded-md" />
                    <Bone className="h-3.5 w-20 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ========== ORDER SUMMARY ========== */}
          <aside className="h-fit rounded-2xl border border-white/8 bg-white/2.5 p-5">
            <Bone className="h-5 w-36 rounded-md" />

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between">
                <Bone className="h-3.5 w-16 rounded-md" />
                <Bone className="h-3.5 w-6 rounded-md" />
              </div>

              <div className="flex items-center justify-between">
                <Bone className="h-3.5 w-16 rounded-md" />
                <Bone className="h-3.5 w-12 rounded-md" />
              </div>

              <div className="border-t border-white/8 pt-4">
                <div className="flex items-center justify-between">
                  <Bone className="h-4 w-12 rounded-md" />
                  <Bone className="h-7 w-20 rounded-md" />
                </div>
              </div>
            </div>

            <Bone className="mt-6 h-11 w-full rounded-xl" />
          </aside>
        </div>
      </div>
    </main>
  );
}

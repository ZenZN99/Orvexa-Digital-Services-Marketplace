"use client";

function Bone({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-white/6 ${className}`} />;
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/2.5 p-5 sm:p-6">
      {children}
    </div>
  );
}

export default function Skeleton() {
  return (
    <main
      className="min-h-screen bg-brand-navy px-5 py-10 sm:px-8 lg:px-12"
      aria-busy="true"
      aria-label="Loading review page"
    >
      <div className="mx-auto w-full max-w-3xl">
        {/* ========== BACK ========== */}
        <Bone className="mb-8 h-4 w-36 rounded-md" />

        {/* ========== HEADER ========== */}
        <div className="mb-8">
          <Bone className="mb-3 h-3.5 w-36 rounded-md" />

          <Bone className="h-8 w-72 max-w-full rounded-lg" />

          <div className="mt-3 max-w-xl space-y-2">
            <Bone className="h-3.5 w-full rounded-md" />
            <Bone className="h-3.5 w-3/4 rounded-md" />
          </div>
        </div>

        {/* ========== FREELANCER ========== */}
        <Card>
          <Bone className="h-3 w-20 rounded-md" />

          <div className="mt-4 flex items-center gap-4">
            <Bone className="h-12 w-12 shrink-0 rounded-full" />

            <div>
              <Bone className="h-4 w-36 rounded-md" />
              <Bone className="mt-2 h-3 w-24 rounded-md" />
            </div>
          </div>
        </Card>

        {/* ========== SERVICE ========== */}
        <div className="mt-4">
          <Card>
            <Bone className="h-3 w-14 rounded-md" />

            <div className="mt-4 flex gap-4">
              <Bone className="h-20 w-20 shrink-0 rounded-xl" />

              <div className="min-w-0 flex-1">
                <Bone className="h-4 w-3/4 rounded-md" />
                <Bone className="mt-2.5 h-3 w-24 rounded-md" />
                <Bone className="mt-2.5 h-4 w-16 rounded-md" />
                <Bone className="mt-3.5 h-3 w-12 rounded-md" />
              </div>
            </div>
          </Card>
        </div>

        {/* ========== REVIEW ========== */}
        <div className="mt-4">
          <Card>
            <Bone className="h-3 w-24 rounded-md" />
            <Bone className="mt-3 h-6 w-56 rounded-md" />
            <Bone className="mt-2.5 h-3.5 w-72 max-w-full rounded-md" />

            {/* Rating */}
            <div className="mt-6">
              <Bone className="mb-3 h-4 w-14 rounded-md" />

              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Bone key={i} className="h-9 w-9 rounded-lg" />
                ))}
              </div>

              <Bone className="mt-3 h-3 w-24 rounded-md" />
            </div>

            {/* Comment */}
            <div className="mt-7">
              <Bone className="h-4 w-20 rounded-md" />
              <Bone className="mt-2 h-32.5 w-full rounded-xl" />
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Bone className="h-11 w-full rounded-xl sm:w-24" />
              <Bone className="h-11 w-full rounded-xl sm:w-40" />
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

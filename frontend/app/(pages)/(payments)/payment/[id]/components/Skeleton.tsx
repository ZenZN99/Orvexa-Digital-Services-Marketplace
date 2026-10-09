"use client";

function Bone({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-white/6 ${className}`} />;
}

function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/8 bg-white/3">
      {children}
    </section>
  );
}

function InfoBox({ tall = false }: { tall?: boolean }) {
  return (
    <div className="rounded-xl border border-white/6 bg-white/2 p-4">
      <Bone className="h-3 w-20 rounded-md" />
      <Bone className={`mt-3.5 rounded-md ${tall ? "h-7 w-28" : "h-4 w-40"}`} />
    </div>
  );
}

export default function Skeleton() {
  return (
    <main
      className="min-h-screen bg-brand-navy px-5 py-28 text-white sm:px-8"
      aria-busy="true"
      aria-label="Loading payment"
    >
      <div className="mx-auto max-w-5xl">
        {/* ========== BACK ========== */}
        <Bone className="h-4 w-36 rounded-md" />

        {/* ========== HEADER ========== */}
        <div className="mt-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <div className="flex items-center gap-3">
              <Bone className="h-11 w-11 shrink-0 rounded-xl" />

              <div>
                <Bone className="h-3 w-14 rounded-md" />
                <Bone className="mt-2 h-6 w-40 rounded-md" />
              </div>
            </div>

            <Bone className="mt-4 h-3.5 w-80 max-w-full rounded-md" />
          </div>

          {/* Status pill */}
          <Bone className="h-8 w-28 rounded-full" />
        </div>

        {/* ========== CONTENT ========== */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* ----- LEFT ----- */}
          <div className="space-y-6">
            {/* Payment summary */}
            <Section>
              <div className="border-b border-white/6 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-2">
                  <Bone className="h-4 w-4 rounded-md" />
                  <Bone className="h-4 w-36 rounded-md" />
                </div>
              </div>

              <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
                <InfoBox tall />
                <InfoBox />
                <InfoBox />
                <InfoBox />
              </div>
            </Section>

            {/* Related order */}
            <Section>
              <div className="flex items-center justify-between border-b border-white/6 px-5 py-4 sm:px-6">
                <div>
                  <Bone className="h-4 w-28 rounded-md" />
                  <Bone className="mt-2 h-3 w-48 rounded-md" />
                </div>

                <Bone className="h-9 w-28 rounded-xl" />
              </div>

              <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                {[0, 1, 2].map((i) => (
                  <div key={i}>
                    <Bone className="h-3 w-16 rounded-md" />
                    <Bone className="mt-2.5 h-4 w-40 max-w-full rounded-md" />
                  </div>
                ))}
              </div>
            </Section>
          </div>

          {/* ----- RIGHT ----- */}
          <aside className="space-y-6">
            {/* Status card */}
            <section className="rounded-2xl border border-white/8 bg-white/3 p-5">
              <Bone className="h-11 w-11 rounded-xl" />
              <Bone className="mt-4 h-4 w-24 rounded-md" />

              <div className="mt-3 space-y-2">
                <Bone className="h-3 w-full rounded-md" />
                <Bone className="h-3 w-4/5 rounded-md" />
              </div>
            </section>

            {/* Customer */}
            <section className="rounded-2xl border border-white/8 bg-white/3 p-5">
              <div className="flex items-center gap-2">
                <Bone className="h-6 w-6 rounded-full" />
                <Bone className="h-4 w-20 rounded-md" />
              </div>

              <div className="mt-5">
                <Bone className="h-4 w-32 rounded-md" />
                <Bone className="mt-2 h-3 w-44 max-w-full rounded-md" />
              </div>
            </section>

            {/* Transaction info */}
            <section className="rounded-2xl border border-white/8 bg-white/3 p-5">
              <Bone className="h-4 w-32 rounded-md" />

              <div className="mt-5 space-y-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Bone className="h-3 w-16 rounded-md" />
                    <Bone className="h-3 w-24 rounded-md" />
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>

        {/* ========== BOTTOM ========== */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Bone className="h-11 w-full rounded-xl sm:w-44" />
          <Bone className="h-11 w-full rounded-xl sm:w-48" />
        </div>
      </div>
    </main>
  );
}

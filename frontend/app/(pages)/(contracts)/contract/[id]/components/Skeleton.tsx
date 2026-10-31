"use client";

const MESSAGES: { mine: boolean; lines: string[] }[] = [
  { mine: false, lines: ["w-56", "w-40"] },
  { mine: true, lines: ["w-44"] },
  { mine: false, lines: ["w-64"] },
  { mine: true, lines: ["w-60", "w-32"] },
  { mine: false, lines: ["w-48"] },
];

function Bone({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-white/6 ${className}`} />;
}

function InfoRowSkeleton({ valueWidth }: { valueWidth: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Bone className="h-3 w-14 rounded-md" />
      <Bone className={`h-3 ${valueWidth} rounded-md`} />
    </div>
  );
}

export default function Skeleton() {
  return (
    <main
      className="min-h-screen bg-brand-navy text-white"
      aria-busy="true"
      aria-label="Loading contract"
    >
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        {/* ========== TOP NAVIGATION ========== */}
        <div className="mb-6 flex items-center gap-2">
          <Bone className="h-4 w-4 rounded-md" />
          <Bone className="h-3.5 w-32 rounded-md" />
        </div>

        <div className="grid h-[calc(100vh-120px)] overflow-hidden rounded-3xl border border-white/8 bg-white/2 lg:grid-cols-[320px_1fr]">
          {/* ========== SIDEBAR (large screens only) ========== */}
          <aside className="hidden flex-col lg:flex">
            {/* Header */}
            <div className="border-b border-white/8 p-6">
              <div className="flex items-center gap-2">
                <Bone className="h-1.5 w-1.5 rounded-full" />
                <Bone className="h-3 w-28 rounded-md" />
              </div>

              <div className="mt-4 space-y-2.5">
                <Bone className="h-5 w-full rounded-md" />
                <Bone className="h-5 w-2/3 rounded-md" />
              </div>
            </div>

            {/* Other user */}
            <div className="border-b border-white/8 p-6">
              <Bone className="h-2.5 w-16 rounded-md" />

              <div className="mt-4 flex items-center gap-3">
                <Bone className="h-10 w-10 shrink-0 rounded-xl" />

                <div className="min-w-0 flex-1">
                  <Bone className="h-3.5 w-32 rounded-md" />
                  <Bone className="mt-2 h-3 w-40 max-w-full rounded-md" />
                </div>
              </div>
            </div>

            {/* Contract information */}
            <div className="p-6">
              <Bone className="h-2.5 w-32 rounded-md" />

              <div className="mt-5 space-y-4">
                <InfoRowSkeleton valueWidth="w-16" />
                <InfoRowSkeleton valueWidth="w-24" />
                <InfoRowSkeleton valueWidth="w-24" />
                <InfoRowSkeleton valueWidth="w-20" />

                <Bone className="mt-6 h-11 w-full rounded-xl" />
              </div>
            </div>
          </aside>

          {/* ========== CHAT ========== */}
          <section className="flex min-h-0 flex-col">
            {/* Contract details toggle (small screens only) */}
            <div className="border-b border-white/8 px-4 py-3 lg:hidden">
              <Bone className="h-10 w-full rounded-xl" />
            </div>

            {/* Chat header */}
            <div className="flex items-center gap-3 border-b border-white/8 px-5 py-4 sm:px-6">
              <Bone className="h-10 w-10 shrink-0 rounded-xl" />

              <div>
                <Bone className="h-3.5 w-36 rounded-md" />

                <div className="mt-2 flex items-center gap-1.5">
                  <Bone className="h-1.5 w-1.5 rounded-full" />
                  <Bone className="h-2.5 w-24 rounded-md" />
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden px-4 py-6 sm:px-6">
              <div className="mx-auto max-w-3xl">
                {/* Day divider */}
                <div className="mb-7 mt-2 flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/6" />
                  <Bone className="h-2.5 w-14 rounded-md" />
                  <div className="h-px flex-1 bg-white/6" />
                </div>

                <div className="space-y-6">
                  {MESSAGES.map((message, i) => (
                    <div
                      key={i}
                      className={`flex items-end gap-3 ${
                        message.mine ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!message.mine && (
                        <Bone className="h-8 w-8 shrink-0 rounded-xl" />
                      )}

                      <div
                        className={`flex max-w-[82%] flex-col ${
                          message.mine ? "items-end" : "items-start"
                        }`}
                      >
                        {/* Name + time */}
                        <div className="mb-1 flex items-center gap-2 px-1">
                          {!message.mine && (
                            <Bone className="h-3 w-20 rounded-md" />
                          )}
                          <Bone className="h-2.5 w-10 rounded-md" />
                        </div>

                        {/* Bubble */}
                        <div
                          className={`space-y-2 rounded-2xl px-4 py-3.5 ${
                            message.mine
                              ? "rounded-br-md bg-white/6"
                              : "rounded-bl-md border border-white/8 bg-white/4.5"
                          }`}
                        >
                          {message.lines.map((width, j) => (
                            <Bone
                              key={j}
                              className={`h-3.5 ${width} max-w-full rounded-md bg-white/8`}
                            />
                          ))}
                        </div>
                      </div>

                      {message.mine && (
                        <Bone className="h-8 w-8 shrink-0 rounded-xl" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Composer */}
            <div className="border-t border-white/8 p-4 sm:p-5">
              <div className="mx-auto max-w-3xl">
                <div className="rounded-2xl border border-white/8 bg-white/2.5 p-2">
                  {/* Textarea */}
                  <div className="px-3 py-2">
                    <Bone className="h-3.5 w-40 rounded-md" />
                    <div className="h-14" />
                  </div>

                  {/* Toolbar */}
                  <div className="flex items-center justify-between px-2 pb-1">
                    <div className="flex items-center gap-1">
                      <Bone className="h-8 w-8 rounded-lg" />
                      <Bone className="h-8 w-8 rounded-lg" />
                    </div>

                    <Bone className="h-9 w-20 rounded-xl" />
                  </div>
                </div>

                <Bone className="mt-2.5 ml-2 h-2.5 w-64 max-w-[80%] rounded-md" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
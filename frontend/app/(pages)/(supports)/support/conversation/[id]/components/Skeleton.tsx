"use client";

function Bone({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-white/6 ${className}`} />;
}

export function MessagesSkeleton() {
  const rows = [
    { mine: false, width: "w-56", lines: 2 },
    { mine: true, width: "w-44", lines: 1 },
    { mine: false, width: "w-64", lines: 3 },
    { mine: true, width: "w-52", lines: 2 },
    { mine: false, width: "w-40", lines: 1 },
  ];

  return (
    <div
      className="mx-auto flex max-w-2xl flex-col gap-4"
      aria-busy="true"
      aria-label="Loading messages"
    >
      {rows.map((row, i) => (
        <div
          key={i}
          className={`flex items-end gap-2.5 ${
            row.mine ? "flex-row-reverse" : "flex-row"
          }`}
        >
          {/* Avatar */}
          <Bone className="h-8 w-8 shrink-0 rounded-full" />

          <div
            className={`flex max-w-[75%] flex-col ${
              row.mine ? "items-end" : "items-start"
            }`}
          >
            {/* Name */}
            <Bone className="mb-1.5 h-3 w-24 rounded-md" />

            {/* Bubble */}
            <div
              className={`space-y-2 rounded-2xl border border-white/6 bg-white/3 px-3.5 py-3 ${
                row.mine ? "rounded-br-sm" : "rounded-bl-sm"
              }`}
            >
              {Array.from({ length: row.lines }).map((_, l) => (
                <Bone
                  key={l}
                  className={`h-3.5 rounded-md ${
                    l === row.lines - 1 && row.lines > 1 ? "w-2/3" : row.width
                  }`}
                />
              ))}
            </div>

            {/* Time */}
            <Bone className="mt-1.5 h-2.5 w-10 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Skeleton() {
  return (
    <main
      className="relative flex h-dvh flex-col overflow-hidden bg-brand-navy text-white"
      aria-busy="true"
      aria-label="Loading conversation"
    >
      {/* ========== HEADER ========== */}
      <header className="z-10 flex items-center gap-3 border-b border-white/8 bg-brand-navy/90 px-4 py-3.5 backdrop-blur-xl">
        <Bone className="h-9 w-9 rounded-full" />
        <Bone className="h-9 w-9 rounded-full" />

        <div className="min-w-0 flex-1">
          <Bone className="h-3.5 w-32 rounded-md" />
          <Bone className="mt-2 h-3 w-24 rounded-md" />
        </div>
      </header>

      {/* ========== MESSAGES ========== */}
      <div className="flex-1 overflow-hidden px-4 py-6">
        <MessagesSkeleton />
      </div>

      {/* ========== COMPOSER ========== */}
      <div className="border-t border-white/8 bg-brand-navy/90 p-3.5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-end gap-2">
          <Bone className="h-10 w-10 shrink-0 rounded-xl" />
          <Bone className="h-10 flex-1 rounded-xl" />
          <Bone className="h-10 w-10 shrink-0 rounded-xl" />
        </div>
      </div>
    </main>
  );
}

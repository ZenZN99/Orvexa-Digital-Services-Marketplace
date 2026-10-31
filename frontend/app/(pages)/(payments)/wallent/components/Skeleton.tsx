"use client";

interface WalletSkeletonProps {
  isClient?: boolean;
}

function Bone({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-white/6 ${className}`} />;
}

function BalanceCard() {
  return (
    <div className="rounded-2xl border border-white/6 bg-white/2 p-5">
      <div className="flex items-center gap-3">
        <Bone className="h-9 w-9 shrink-0 rounded-xl" />

        <div>
          <Bone className="h-3 w-28 rounded-md" />
          <Bone className="mt-2.5 h-6 w-24 rounded-md" />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Bone className="h-3 w-full rounded-md" />
        <Bone className="h-3 w-2/3 rounded-md" />
      </div>
    </div>
  );
}

export default function Skeleton({ isClient = true }: WalletSkeletonProps) {
  return (
    <main
      className="min-h-screen bg-brand-navy px-6 py-28 text-white"
      aria-busy="true"
      aria-label="Loading wallet"
    >
      <div className="mx-auto max-w-5xl">
        {/* ========== HEADER ========== */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Bone className="h-3.5 w-14 rounded-md" />
            <Bone className="mt-3 h-8.5 w-64 max-w-full rounded-lg" />
            <Bone className="mt-3 h-3.5 w-80 max-w-full rounded-md" />
          </div>

          {isClient && <Bone className="h-11 w-36 rounded-xl" />}
        </div>

        {/* ========== MAIN BALANCE ========== */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-white/[0.07] bg-white/2.5">
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between">
              <div>
                <Bone className="h-3 w-24 rounded-md" />
                <Bone className="mt-4 h-10 w-48 rounded-lg sm:h-12" />
              </div>

              <Bone className="h-12 w-12 rounded-2xl" />
            </div>

            <div className="mt-8 h-px bg-white/6" />

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <BalanceCard />
              <BalanceCard />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

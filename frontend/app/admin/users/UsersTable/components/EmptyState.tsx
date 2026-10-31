import { SearchX } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/2.5">
      <div className="relative flex min-h-80 flex-col items-center justify-center px-6 py-16 text-center">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-green/4 blur-3xl" />
        </div>

        {/* Icon */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/2.5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/4">
            <SearchX size={20} strokeWidth={1.7} className="text-white/45" />
          </div>
        </div>

        {/* Content */}
        <div className="relative mt-6 max-w-sm">
          <h3 className="text-base font-semibold tracking-tight text-white/90">
            No users found
          </h3>

          <p className="mt-2 text-sm leading-6 text-white/50">
            Try changing your search or filters.
          </p>
        </div>

        {/* Status */}
        <div className="relative mt-5 inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/2.5 px-3 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-white/25" />

          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/40">
            No results
          </span>
        </div>
      </div>
    </div>
  );
}

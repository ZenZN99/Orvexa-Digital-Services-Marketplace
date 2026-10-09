"use client";

interface EmptyProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function Empty({
  title = "Nothing found",
  description = "Unfortunately, we couldn't find anything matching your search.",
  actionLabel = "Clear Search",
  onAction,
}: EmptyProps) {
  return (
    <div className="relative flex min-h-112.5 items-center justify-center overflow-hidden rounded-3xl border border-white/[0.07] bg-brand-navy/15 px-6 text-center">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-green/4 blur-3xl" />

      <div className="relative flex max-w-md flex-col items-center">
        {/* Emoji */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-[28px] bg-brand-green/6 blur-2xl" />

          <div className="relative flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/8 bg-white/[0.035] shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
            <span
              className="inline-block animate-[wiggle_1.5s_ease-in-out_infinite] text-[42px] leading-none"
              role="img"
              aria-label="Sad face"
            >
              😔
            </span>
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold tracking-tight text-white">
          {title}
        </h3>

        <p className="mt-3 max-w-sm text-sm leading-6 text-white/35">
          {description}
        </p>

        {/* Action */}
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="mt-7 rounded-xl bg-brand-green px-6 py-2.5 text-sm font-semibold text-brand-navy shadow-[0_8px_30px_rgba(0,220,130,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_12px_35px_rgba(0,220,130,0.14)] active:translate-y-0"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

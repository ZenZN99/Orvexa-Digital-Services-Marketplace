"use client";

export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-0 h-125 w-175 -translate-x-1/2 rounded-full bg-brand-green/4 blur-[140px]" />
    </div>
  );
}

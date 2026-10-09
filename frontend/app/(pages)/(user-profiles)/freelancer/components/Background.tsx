"use client";

export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-0 h-137.5 w-187.5 -translate-x-1/2 rounded-full bg-brand-green/[0.035] blur-[150px]" />
    </div>
  );
}

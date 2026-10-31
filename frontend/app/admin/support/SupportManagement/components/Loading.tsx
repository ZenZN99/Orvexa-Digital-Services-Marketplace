"use client";


export default function Loading() {
  return (
    <div className="flex min-h-105 items-center justify-center p-6 lg:p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-green/30 border-t-brand-green" />
    </div>
  );
}

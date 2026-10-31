"use client";


export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-navy py-28 text-white">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-green/30 border-t-brand-green" />
    </main>
  );
}

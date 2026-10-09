"use client";

import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-navy px-4 py-28 text-white">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/4">
          <SearchX size={26} className="text-white/30" />
        </div>
        <h1 className="mt-5 text-lg font-semibold">Payment not found</h1>
        <p className="mt-2 text-sm text-white/45">
          This payment doesn't exist or doesn't belong to your account.
        </p>
        <Link
          href="/payments"
          className="mt-6 h-11 rounded-xl bg-brand-green px-5 text-sm font-semibold leading-11 text-brand-navy transition hover:opacity-90"
        >
          Back to payments
        </Link>
      </div>
    </main>
  );
}

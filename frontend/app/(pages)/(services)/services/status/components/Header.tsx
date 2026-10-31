"use client";

import { Plus } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">My services status</h1>
        <p className="mt-1 text-sm text-white/40">
          Track the review status of every service you submitted.
        </p>
      </div>

      <Link
        href="/create-service"
        className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-green px-4 text-sm font-semibold text-brand-navy transition hover:opacity-90"
      >
        <Plus size={16} />
        New service
      </Link>
    </div>
  );
}

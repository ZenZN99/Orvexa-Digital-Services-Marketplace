"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TopNavigation() {
  return (
    <div className="mb-6 flex items-center justify-between">
      <Link
        href="/contracts"
        className="inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to contracts
      </Link>
    </div>
  );
}

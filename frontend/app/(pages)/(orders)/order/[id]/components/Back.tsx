"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Back() {
  return (
    <div>
      <Link
        href="/orders"
        className="mb-8 inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to Orders
      </Link>
    </div>
  );
}

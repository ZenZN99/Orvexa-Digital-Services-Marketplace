"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Back() {
  return (
    <Link
      href="/payments"
      className="inline-flex items-center gap-2 text-sm text-white/35 transition hover:text-white"
    >
      <ArrowLeft size={16} />
      Back to payments
    </Link>
  );
}

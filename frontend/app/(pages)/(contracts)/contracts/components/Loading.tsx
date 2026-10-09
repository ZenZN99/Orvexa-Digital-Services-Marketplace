"use client";

import { Loader2 } from "lucide-react";


export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-navy py-28 text-white">
      <Loader2 size={26} className="animate-spin text-brand-green" />
    </main>
  );
}

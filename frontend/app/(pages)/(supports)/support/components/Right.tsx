"use client";
import Image from "next/image";

export default function Right() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand-green/10 blur-[120px]" />

      <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-white/3 p-2 shadow-2xl">
        <div className="overflow-hidden rounded-2xl border border-white/6 bg-[#08131a]">
          <div className="relative aspect-16/10">
            <Image
              src="/support.jpg"
              alt="Orvexa Support"
              fill
              className="object-cover"
              priority
            />

            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#08131a]/40 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}

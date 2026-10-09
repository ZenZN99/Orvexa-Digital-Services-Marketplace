"use client";
import Image from "next/image";
import Link from "next/link";

export default function RightImage() {
  return (
    <section className="relative hidden min-h-screen w-1/2 overflow-hidden lg:block">
      <img
        src="/logo.png"
        alt="Orvexa"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-linear-to-t from-brand-navy/80 via-brand-navy/20 to-brand-navy/10" />

      {/* Logo */}
      <div className="absolute left-10 top-10 xl:left-14 xl:top-12">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/favicon.ico"
            alt="Orvexa"
            width={32}
            height={32}
            priority
            className="h-9 w-9 rounded-xl object-contain"
          />

          <span className="text-xl font-bold tracking-tight text-white">
            Orvexa
          </span>
        </Link>
      </div>

      {/* Minimal content */}
      <div className="absolute bottom-10 left-10 right-10 xl:bottom-14 xl:left-14 xl:right-14">
        <p className="text-sm font-medium text-brand-green">Orvexa</p>

        <h2 className="mt-2 max-w-lg text-3xl font-semibold leading-tight tracking-tight text-white xl:text-4xl">
          Great work starts with the right people.
        </h2>
      </div>
    </section>
  );
}

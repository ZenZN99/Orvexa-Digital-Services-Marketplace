"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "orvexa-announcement-dismissed";
const HIDE_DURATION = 24 * 60 * 60 * 1000;

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissedAt = localStorage.getItem(STORAGE_KEY);

    if (!dismissedAt) {
      setVisible(true);
      return;
    }

    const elapsed = Date.now() - Number(dismissedAt);

    if (elapsed >= HIDE_DURATION) {
      localStorage.removeItem(STORAGE_KEY);
      setVisible(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="relative z-60 w-full bg-brand-green">
      <div className="mx-auto flex min-h-12 w-full max-w-[1600px] items-center justify-center px-6 sm:px-10 lg:px-16">
        <Link
          href="/updates"
          className="group flex items-center justify-center gap-2.5 py-3 text-sm font-medium text-white transition sm:text-[15px]"
        >
          <Sparkles size={16} strokeWidth={2} className="shrink-0 text-white" />

          <span className="font-semibold">New</span>

          <span className="hidden opacity-50 sm:inline">—</span>

          <span>Discover what&apos;s new in Orvexa</span>

          <ArrowRight
            size={16}
            strokeWidth={2}
            className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>

        <button
          type="button"
          onClick={handleClose}
          aria-label="Close announcement"
          className="absolute right-4 flex h-8 w-8 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white sm:right-6 lg:right-10"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

const stats = [
  { value: "12K+", label: "Services" },
  { value: "8.5K+", label: "Freelancers" },
  { value: "$2.4M+", label: "Total Earned" },
  { value: "45K+", label: "Projects" },
  { value: "98%", label: "Satisfaction" },
  { value: "120+", label: "Categories" },
];

export default function StatsMarquee() {
  const [paused, setPaused] = useState(false);

  return (
    <section className="w-full overflow-hidden border-y border-white/[0.05] bg-brand-navy">
      <div
        className="relative flex w-max"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* First track */}
        <div
          className={`flex shrink-0 items-center ${
            paused ? "[animation-play-state:paused]" : ""
          }`}
          style={{
            animation: "orvexa-marquee 28s linear infinite",
          }}
        >
          {[...stats, ...stats].map((stat, index) => (
            <div
              key={`first-${index}`}
              className="group flex h-20 min-w-[190px] cursor-default items-center justify-center border-r border-white/[0.06] px-8 transition-colors duration-300 hover:bg-white/[0.02]"
            >
              <div className="flex items-baseline gap-2 whitespace-nowrap">
                <span className="text-2xl font-semibold tracking-tight text-white/25 transition-colors duration-300 group-hover:text-brand-green sm:text-3xl">
                  {stat.value}
                </span>

                <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/20 transition-colors duration-300 group-hover:text-white/60">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Second track */}
        <div
          className={`flex shrink-0 items-center ${
            paused ? "[animation-play-state:paused]" : ""
          }`}
          style={{
            animation: "orvexa-marquee 28s linear infinite",
          }}
          aria-hidden="true"
        >
          {[...stats, ...stats].map((stat, index) => (
            <div
              key={`second-${index}`}
              className="group flex h-20 min-w-[190px] cursor-default items-center justify-center border-r border-white/[0.06] px-8 transition-colors duration-300 hover:bg-white/[0.02]"
            >
              <div className="flex items-baseline gap-2 whitespace-nowrap">
                <span className="text-2xl font-semibold tracking-tight text-white/25 transition-colors duration-300 group-hover:text-brand-green sm:text-3xl">
                  {stat.value}
                </span>

                <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/20 transition-colors duration-300 group-hover:text-white/60">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes orvexa-marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-100%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          div {
            animation-play-state: paused !important;
          }
        }
      `}</style>
    </section>
  );
}

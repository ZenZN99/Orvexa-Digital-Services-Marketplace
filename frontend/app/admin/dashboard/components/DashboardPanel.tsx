"use client";

import { Wallet } from "lucide-react";
import { ReactNode } from "react";
import Reveal from "./Reveal";

interface DashboardPanelProps {
  title: string;
  description: string;
  icon: typeof Wallet;
  delay?: number;
  children: ReactNode;
}

export default function DashboardPanel({
  title,
  description,
  icon: Icon,
  delay = 0,
  children,
}: DashboardPanelProps) {
  return (
    <Reveal delay={delay} className="h-full">
      <div className="group/panel h-full rounded-2xl border border-white/[0.07] bg-white/2.5 p-5 transition-colors duration-300 hover:border-white/12">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/4 text-white/40 transition-colors duration-300 group-hover/panel:bg-brand-green/10 group-hover/panel:text-brand-green">
            <Icon size={16} strokeWidth={1.8} />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white">{title}</h3>

            <p className="mt-0.5 text-xs text-white/30">{description}</p>
          </div>
        </div>

        {children}
      </div>
    </Reveal>
  );
}

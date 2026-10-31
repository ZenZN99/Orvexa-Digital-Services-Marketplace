"use client";

import { ISupportConversation } from "@/app/types/support-conversation";

interface StatsProps {
  myConversations: ISupportConversation[];
  openCount: number;
  closedCount: number;
}

export default function Stats({
  myConversations,
  openCount,
  closedCount,
}: StatsProps) {
  return (
    <div className="mb-6 grid grid-cols-3 gap-3">
      <div className="rounded-xl border border-white/8 bg-white/2.5 p-3 text-center">
        <p className="text-lg font-bold text-white">{myConversations.length}</p>
        <p className="text-xs text-white/35">Total</p>
      </div>
      <div className="rounded-xl border border-white/8 bg-white/2.5 p-3 text-center">
        <p className="text-lg font-bold text-emerald-400">{openCount}</p>
        <p className="text-xs text-white/35">Open</p>
      </div>
      <div className="rounded-xl border border-white/8 bg-white/2.5 p-3 text-center">
        <p className="text-lg font-bold text-white/50">{closedCount}</p>
        <p className="text-xs text-white/35">Closed</p>
      </div>
    </div>
  );
}

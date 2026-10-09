"use client";

import { MessageSquare } from "lucide-react";


export default function Header() {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-green/10">
            <MessageSquare size={17} className="text-brand-green" />
          </div>

          <span className="text-xs font-medium uppercase tracking-[0.14em] text-brand-green">
            Customer Support
          </span>
        </div>

        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
          Support Conversations
        </h2>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-white/35">
          Monitor customer support conversations and manage open requests from
          the admin panel.
        </p>
      </div>
    </div>
  );
}

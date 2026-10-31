"use client";

import { MessageSquare } from "lucide-react";

export default function Header() {
  return (
    <div className="mb-7 flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
        <MessageSquare size={21} />
      </div>
      <div>
        <h1 className="text-xl font-bold">Support Conversations</h1>
        <p className="mt-1 text-sm text-white/40">
          All conversations from users across the platform.
        </p>
      </div>
    </div>
  );
}

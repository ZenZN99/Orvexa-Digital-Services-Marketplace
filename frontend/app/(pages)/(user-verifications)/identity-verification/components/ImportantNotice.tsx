"use client";

import { AlertTriangle } from "lucide-react";

export default function ImportantNotice() {
  return (
    <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-amber-400/15 bg-amber-400/4 p-4 sm:p-5">
      <div className="flex gap-3">
        <div className="mt-0.5 shrink-0">
          <AlertTriangle size={18} className="text-amber-400" />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-amber-300">
            Please make sure your photos are clear
          </h2>

          <p className="mt-1.5 text-xs leading-5 text-white/45">
            Your identity will not be verified if the uploaded images are
            blurry, too dark, cropped, edited, or if the information on your
            identity document cannot be clearly read.
          </p>
        </div>
      </div>
    </div>
  );
}

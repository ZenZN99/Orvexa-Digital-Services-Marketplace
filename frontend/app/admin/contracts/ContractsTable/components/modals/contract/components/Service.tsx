"use client";

import { IContract } from "@/app/types/contract";
import { Package } from "lucide-react";

export default function Service({ contract }: { contract: IContract }) {
  return (
    <div className="rounded-xl border border-white/6 bg-white/2.5 p-4">
      <div className="flex items-center gap-2">
        <Package size={15} className="text-brand-green" />

        <p className="text-xs font-semibold text-white/50">Service</p>
      </div>

      <p className="mt-2 text-sm font-medium text-white">
        {contract.service?.title}
      </p>
    </div>
  );
}

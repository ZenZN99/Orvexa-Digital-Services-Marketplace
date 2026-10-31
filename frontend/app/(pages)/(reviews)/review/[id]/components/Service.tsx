"use client";

import Link from "next/link";
import { IContract } from "@/app/types/contract";
import { ArrowUpRight, ImageIcon } from "lucide-react";

export default function Service({ contract }: { contract: IContract }) {
  return (
    <div className="mt-4 rounded-2xl border border-white/[0.07] bg-white/2.5 p-5 sm:p-6">
      <p className="text-[11px] font-medium uppercase tracking-wider text-white/25">
        Service
      </p>

      <div className="mt-4 flex gap-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white/5">
          {contract.service?.images?.[0]?.url ? (
            <img
              src={contract.service.images[0].url}
              alt={contract.service.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-white/20">
              <ImageIcon size={18} />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <h2 className="text-sm font-semibold leading-5 text-white">
            {contract.service?.title}
          </h2>

          <p className="mt-2 text-xs text-white/35 capitalize">
            {contract.service?.category?.replaceAll("_", " ")}
          </p>

          <p className="mt-2 text-sm font-semibold text-brand-green">
            ${Number(contract.amount).toFixed(2)}
          </p>

          <Link
            href={`/service/${contract.service?.id}`}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white/40 transition hover:text-brand-green"
          >
            View
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
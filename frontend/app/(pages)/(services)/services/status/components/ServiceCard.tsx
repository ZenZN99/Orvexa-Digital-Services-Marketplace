"use client";

import Link from "next/link";
import { IService, ServiceStatus } from "@/app/types/service";
import { statusConfig } from "../utils/statusConfig";
import { formatCategory } from "../utils/formatCategory";
import { ArrowRight, Clock, ImageIcon, Package, Pencil } from "lucide-react";

export default function ServiceCard({ service }: { service: IService }) {
  const config =
    statusConfig[service.status as keyof typeof statusConfig] ??
    statusConfig[ServiceStatus.PENDING];

  const Icon = config.icon;
  const cover = service.images?.[0]?.url;

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-2xl border bg-white/2 ${config.card}`}
    >
      {/* Status banner (the most important part) */}
      <div className={`border-b p-4 ${config.banner}`}>
        <div className="flex items-start gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${config.iconWrap}`}
          >
            <Icon size={18} />
          </div>

          <div className="min-w-0">
            <p className={`text-sm font-bold ${config.title}`}>
              {config.label}
            </p>

            {service.status === ServiceStatus.PENDING && (
              <p className={`mt-1 text-xs leading-5 ${config.text}`}>
                Your service is under review. You will get a notification as
                soon as our team finishes reviewing it.
              </p>
            )}

            {service.status === ServiceStatus.REJECTED && (
              <div className="mt-1">
                <p
                  className={`text-[11px] font-semibold uppercase tracking-wide ${config.text}`}
                >
                  Reason
                </p>
                <p className="mt-0.5 whitespace-pre-line wrap-break-word text-xs leading-5 text-red-100/80">
                  {service.reason || "No reason was provided."}
                </p>
              </div>
            )}

            {service.status === ServiceStatus.PUBLISHED && (
              <p className={`mt-1 text-xs leading-5 ${config.text}`}>
                Your service is live and visible to clients.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Cover */}
      <div className="relative aspect-16/10 overflow-hidden bg-black/20">
        {cover ? (
          <img
            src={cover}
            alt={service.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/20">
            <ImageIcon size={32} />
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-brand-navy/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/70 backdrop-blur-md">
          {formatCategory(service.category)}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-base font-semibold text-white">
          {service.title}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-white/35">
          {service.description}
        </p>

        <div className="mt-4 flex items-center justify-between text-xs text-white/40">
          <span className="inline-flex items-center gap-1.5">
            <Clock size={13} />
            {service.deliveryDays} day(s)
          </span>

          <span className="inline-flex items-center gap-1.5">
            <Package size={13} />
            {service.ordersCount ?? 0} orders
          </span>

          <span className="text-sm font-semibold text-white">
            ${service.price}
          </span>
        </div>

        {service.status === ServiceStatus.PUBLISHED && (
          <Link
            href={`/service/${service.id}`}
            className="group/button mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/3 text-sm font-semibold text-white/70 transition-all duration-300 hover:border-brand-green/20 hover:bg-brand-green hover:text-brand-navy"
          >
            View Service
            <ArrowRight
              size={15}
              className="transition-transform duration-300 group-hover/button:translate-x-1"
            />
          </Link>
        )}

        {service.status === ServiceStatus.REJECTED && (
          <Link
            href={`/edit-service/${service.id}`}
            className="group/button mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-red-500/10 bg-red-500/5 text-sm font-semibold text-red-300 transition-all duration-300 hover:border-brand-green/20 hover:bg-brand-green hover:text-brand-navy"
          >
            <Pencil
              size={14}
              className="transition-transform duration-300 group-hover/button:rotate-[-5deg]"
            />
            Edit Service
          </Link>
        )}
      </div>
    </article>
  );
}

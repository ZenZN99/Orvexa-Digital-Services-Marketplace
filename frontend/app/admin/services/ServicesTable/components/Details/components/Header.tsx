"use client";

import { Tag } from "lucide-react";
import { IService, ServiceStatus } from "@/app/types/service";
import { formatCategory } from "../../../utils/formats";
import { statusConfig } from "../utils/statusConfig";

interface HeaderProps {
  service: IService;
  className?: string;
}

export default function Header({ service, className }: HeaderProps) {
  const status = statusConfig[service.status];

  const StatusIcon = status.icon;

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${status.className}`}
          >
            <StatusIcon size={13} />
            {status.label}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/4 px-2.5 py-1 text-[11px] text-white/45">
            <Tag size={12} />
            {formatCategory(service.category)}
          </span>
        </div>

        <h1 className="mt-3 text-2xl font-bold text-white">{service.title}</h1>

        <p className="mt-1 text-xs text-white/30">ID: {service.id}</p>
      </div>

      <div className="text-right">
        <p className="text-xs text-white/30">Starting price</p>

        <p className="text-2xl font-bold text-brand-green">${service.price}</p>
      </div>
    </div>
  );
}

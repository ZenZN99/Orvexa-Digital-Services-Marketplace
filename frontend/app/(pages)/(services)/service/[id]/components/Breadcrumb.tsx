"use client";

import { IService } from "@/app/types/service";

interface BreadcrumbProps {
  service: IService | null;
}

export default function Breadcrumb({ service }: BreadcrumbProps) {
  return (
    <div className="mb-8 flex items-center gap-2 text-sm text-white/40">
      <span>Services</span>
      <span>/</span>
      <span>{service?.category}</span>
      <span>/</span>
      <span className="text-white">{service?.title}</span>
    </div>
  );
}

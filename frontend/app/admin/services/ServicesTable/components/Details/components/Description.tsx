"use client";

import { IService } from "@/app/types/service";

interface DescriptionProps {
  service: IService;
}

export default function Description({ service }: DescriptionProps) {
  return (
    <section className="rounded-2xl border border-white/[0.07] bg-white/2 p-5">
      <h2 className="text-sm font-semibold text-white">Description</h2>
      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-white/50">
        {service.description}
      </p>
    </section>
  );
}

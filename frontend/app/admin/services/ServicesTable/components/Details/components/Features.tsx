"use client";

import { IService } from "@/app/types/service";
import { CheckCircle2 } from "lucide-react";
import React from "react";

interface FeaturesProps {
  service: IService;
}

export default function Features({ service }: FeaturesProps) {
  return (
    <div>
      {service.features?.length > 0 && (
        <section className="rounded-2xl border border-white/[0.07] bg-white/2 p-5">
          <h2 className="text-sm font-semibold text-white">Features</h2>
          <ul className="mt-3 space-y-2">
            {service.features.map((feature, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-white/55"
              >
                <CheckCircle2
                  size={15}
                  className="mt-0.5 shrink-0 text-brand-green"
                />
                {feature}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

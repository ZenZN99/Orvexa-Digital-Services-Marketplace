"use client";

import { IService } from "@/app/types/service";
import { Check } from "lucide-react";

interface FeaturesProps {
  service: IService | null;
}

export default function Features({ service }: FeaturesProps) {
  return (
    <div>
      {service!.features.length > 0 && (
        <div className="mt-7">
          <h2 className="text-lg font-semibold text-white">
            What you will get
          </h2>

          <ul className="mt-4 space-y-3">
            {service?.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3 text-white/70">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-green text-xs text-brand-navy">
                  <Check />
                </span>

                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

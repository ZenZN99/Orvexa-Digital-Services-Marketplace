"use client";

import { IService } from "@/app/types/service";

interface KeywordsProps {
  service: IService;
}

export default function Keywords({ service }: KeywordsProps) {
  return (
    <div>
      {service.keywords?.length > 0 && (
        <section className="rounded-2xl border border-white/[0.07] bg-white/2 p-5">
          <h2 className="text-sm font-semibold text-white">Keywords</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {service.keywords.map((keyword, i) => (
              <span
                key={i}
                className="rounded-full border border-white/10 bg-white/4 px-3 py-1 text-xs text-white/50"
              >
                {keyword}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

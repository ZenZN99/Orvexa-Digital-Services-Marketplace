"use client";

import { IService } from "@/app/types/service";

interface KeywordsProps {
  service: IService | null;
}

export default function Keywords({ service }: KeywordsProps) {
  return (
    <div>
      {service!.keywords.length > 0 && (
        <div className="mt-7">
          <div className="flex flex-wrap gap-2">
            {service?.keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-lg bg-white/5 px-3 py-1.5 text-sm text-white/60"
              >
                #{keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

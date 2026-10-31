"use client";

import { IService } from "@/app/types/service";

interface RatingProps {
  service: IService | null;
}

export default function Rating({ service }: RatingProps) {
  const rating = Number(service?.ratingAverage ?? 0);

  return (
    <div className="mt-5 flex items-center gap-3">
      <div className="flex items-center gap-1">
        <span className="text-lg font-semibold text-white">
          {rating.toFixed(1)}
        </span>

        <span className="text-yellow-400">★</span>
      </div>

      <span className="text-sm text-white/40">
        {Number(service?.ratingAverage ?? 0).toFixed(1)}
      </span>
    </div>
  );
}

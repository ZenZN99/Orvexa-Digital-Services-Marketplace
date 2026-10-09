"use client";

import RatingStars from "../../../components/RatingStars";
import { IFreelancer } from "@/app/types/freelancer";

export default function Rating({
  freelancer,
}: {
  freelancer: IFreelancer | null;
}) {
  return (
    <div className="mt-4 flex items-center gap-3">
      <RatingStars rating={freelancer?.ratingAverage as number} />

      <span className="text-sm font-semibold text-white">
        {freelancer?.ratingAverage}
      </span>

      <span className="text-sm text-white/35">
        ({freelancer?.ratingCount} reviews)
      </span>
    </div>
  );
}

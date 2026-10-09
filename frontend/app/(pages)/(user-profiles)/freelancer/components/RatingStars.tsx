"use client";

import { Star } from "lucide-react";

export default function RatingStars({
  rating,
  size = 15,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          strokeWidth={1.8}
          className={
            star <= Math.round(rating)
              ? "fill-brand-green text-brand-green"
              : "text-white/15"
          }
        />
      ))}
    </div>
  );
}

"use client";

import { IUser } from "@/app/types/user";
import RatingStars from "./RatingStars";

export default function Rating({ user }: { user: IUser }) {
  return (
    <div className="mt-4 flex items-center gap-3">
      <RatingStars rating={user.freelancer.ratingAverage} />

      <span className="text-sm font-semibold text-white">
        {user.freelancer.ratingAverage}
      </span>

      <span className="text-sm text-white/35">
        ({user.freelancer.ratingCount} reviews)
      </span>
    </div>
  );
}

"use client";

import { IUser } from "@/app/types/user";

export default function QuickStats({ user }: { user: IUser }) {
  return (
    <div className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
      <div className="text-center">
        <p className="text-xl font-semibold">
          {user.freelancer.completedOrders}
        </p>
        <p className="mt-1 text-xs text-white/35">Completed orders</p>
      </div>

      <div className="h-8 w-px bg-white/8" />

      <div className="text-center">
        <p className="text-xl font-semibold">{user.freelancer.ratingCount}</p>
        <p className="mt-1 text-xs text-white/35">Reviews</p>
      </div>

      <div className="h-8 w-px bg-white/8" />

      <div className="text-center">
        <p className="text-xl font-semibold">{user.freelancer.skills.length}</p>
        <p className="mt-1 text-xs text-white/35">Skills</p>
      </div>
    </div>
  );
}

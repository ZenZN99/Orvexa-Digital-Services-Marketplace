"use client";

import { IService } from "@/app/types/service";
import { Star } from "lucide-react";

interface StatsProps {
  services: IService[];
  totalOrders: number;
  totalImages: number;
  averageRating: number;
}
export default function Stats({
  services,
  totalOrders,
  totalImages,
  averageRating,
}: StatsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/6 px-5 py-4">
      <div className="flex flex-wrap items-center gap-5">
        <span className="text-xs text-white/30">
          {services.length} {services.length === 1 ? "service" : "services"}
        </span>

        <span className="text-xs text-white/30">
          {totalOrders} {totalOrders === 1 ? "order" : "orders"}
        </span>

        <span className="text-xs text-white/30">
          {totalImages} {totalImages === 1 ? "image" : "images"}
        </span>
      </div>

      <span className="flex items-center gap-1.5 text-xs font-medium text-white/45">
        <Star size={13} className="fill-yellow-300 text-yellow-300" />

        <span className="text-white/70">
          {Number(averageRating).toFixed(1)}
        </span>

        <span className="text-white/25">average rating</span>
      </span>
    </div>
  );
}

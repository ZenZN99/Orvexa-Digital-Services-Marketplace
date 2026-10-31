"use client";

import InfoRow from "./InfoRow";
import { Clock, DollarSign, ImageIcon, Package, Star } from "lucide-react";
import { IService } from "@/app/types/service";

interface InfoProps {
  service: IService;
  images: IService["images"];
}

export default function Info({ service, images }: InfoProps) {
  return (
    <section className="rounded-2xl border border-white/[0.07] bg-white/2 p-5">
      <h2 className="text-sm font-semibold text-white">Information</h2>

      <dl className="mt-4 space-y-4">
        <InfoRow
          icon={<DollarSign size={14} />}
          label="Price"
          value={`$${service.price}`}
        />
        <InfoRow
          icon={<Clock size={14} />}
          label="Delivery"
          value={`days (${service.deliveryDays})`}
        />
        <InfoRow
          icon={<Package size={14} />}
          label="Orders"
          value={String(service.ordersCount ?? 0)}
        />
        <InfoRow
          icon={<Star size={14} />}
          label="Rating"
          value={
            service.ratingCount > 0
              ? `${service.ratingAverage} (${service.ratingCount})`
              : "No ratings yet"
          }
        />
        <InfoRow
          icon={<ImageIcon size={14} />}
          label="Images"
          value={String(images.length)}
        />
      </dl>
    </section>
  );
}

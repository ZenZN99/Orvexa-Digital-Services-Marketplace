"use client";

import { ShoppingBag } from "lucide-react";
import { formatCurrency } from "../../../../utils/helpers";
import { IOrder } from "@/app/types/order";
import Link from "next/link";

interface ServicesProps {
  services: IOrder["services"];
}

export default function Services({ services }: ServicesProps) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold text-white/50">Services</p>

        <span className="text-[10px] text-white/25">
          {services.length} {services.length === 1 ? "service" : "services"}
        </span>
      </div>

      {services.length > 0 ? (
        <div className="space-y-2">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex gap-3 rounded-xl border border-white/6 bg-white/2.5 p-3"
            >
              {service.images?.[0]?.url ? (
                <Link href={`/service/${service.id}`}>
                  <img
                    src={service.images[0].url}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-lg object-cover transition-all duration-200 hover:scale-110"
                  />
                </Link>
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-white/4">
                  <ShoppingBag size={16} className="text-white/20" />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">
                  {service.title}
                </p>

                <p className="mt-1 line-clamp-1 text-xs text-white/30">
                  {service.description}
                </p>

                <div className="mt-2 flex items-center gap-4 text-xs text-white/40">
                  <span>{formatCurrency(service.price)}</span>

                  <span>{service.deliveryDays} days</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-white/6 bg-white/2.5 p-5 text-center">
          <ShoppingBag size={20} className="mx-auto text-white/15" />

          <p className="mt-2 text-xs text-white/30">
            No service information available
          </p>
        </div>
      )}
    </div>
  );
}

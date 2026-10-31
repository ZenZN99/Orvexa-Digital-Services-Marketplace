"use client";

import { ICartItem } from "@/app/types/cart-item";
import { Loader2, Trash2 } from "lucide-react";

interface ItemsProps {
  cartItems: ICartItem[];
  loading: {
    removing: Record<string, boolean>;
  };
  removeItem: (itemId: string) => void;
}

export default function Items({ cartItems, loading, removeItem }: ItemsProps) {
  return (
    <div className="space-y-4">
      {cartItems.map((item) => {
        const service = item.service;
        const isRemoving = !!loading.removing[item.serviceId];

        return (
          <div
            key={item.id}
            className="flex gap-5 rounded-2xl border border-white/8 bg-white/2.5 p-4"
          >
            <img
              src={service.images[0]?.url}
              alt={service.title}
              className="h-32 w-44 shrink-0 rounded-xl object-cover"
            />

            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium capitalize text-brand-green">
                {service.category.replace("_", " ")}
              </p>

              <h2 className="mt-1 line-clamp-2 text-base font-semibold text-white">
                {service.title}
              </h2>

              <div className="mt-3 flex items-center gap-4 text-xs text-white/35">
                <span>{service.deliveryDays} days delivery</span>

                <span>★ {service.ratingAverage}</span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xl font-bold text-brand-green">
                  ${service.price}
                </span>

                <button
                  type="button"
                  onClick={() => removeItem(item.serviceId)}
                  disabled={isRemoving}
                  className="flex items-center gap-2 text-xs font-medium text-red-400/80 transition hover:text-red-400 disabled:opacity-40"
                >
                  {isRemoving ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}

                  {isRemoving ? "Removing..." : "Remove"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

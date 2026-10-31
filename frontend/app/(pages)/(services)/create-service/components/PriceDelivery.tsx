"use client";

import { Clock, DollarSign } from "lucide-react";
import { ServiceForm } from "./LeftForm";

interface PriceDeliveryProps {
  form: ServiceForm;
  setForm: React.Dispatch<React.SetStateAction<ServiceForm>>;
  errors: {
    price?: string;
    deliveryDays?: string;
  };
  priceMin: number;
  deliveryDaysMin: number;
  deliveryDaysMax: number;
}

export default function PriceDelivery({
  form,
  setForm,
  errors,
  priceMin,
  deliveryDaysMin,
  deliveryDaysMax,
}: PriceDeliveryProps) {
  return (
    <div className="grid grid-cols-2 gap-4 rounded-2xl border border-white/8 bg-brand-navy/40 p-5 backdrop-blur-xl">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-white/80">
          Price (USD)
        </label>
        <div className="relative">
          <DollarSign
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
          />
          <input
            type="number"
            min={priceMin}
            value={form.price}
            onChange={(e) =>
              setForm((p) => ({ ...p, price: Number(e.target.value) }))
            }
            placeholder="120"
            className="w-full rounded-lg border border-white/[0.07] bg-white/2.5 py-2.5 pl-8 pr-3 text-sm text-white outline-none"
          />
        </div>
        {errors.price && (
          <p className="mt-1.5 text-xs text-red-400">{errors.price}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-white/80">
          Delivery time (days)
        </label>
        <div className="relative">
          <Clock
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
          />
          <input
            type="number"
            min={deliveryDaysMin}
            max={deliveryDaysMax}
            value={form.deliveryDays}
            onChange={(e) =>
              setForm((p) => ({ ...p, deliveryDays: Number(e.target.value) }))
            }
            placeholder="3"
            className="w-full rounded-lg border border-white/[0.07] bg-white/2.5 py-2.5 pl-8 pr-3 text-sm text-white outline-none"
          />
        </div>
        {errors.deliveryDays && (
          <p className="mt-1.5 text-xs text-red-400">{errors.deliveryDays}</p>
        )}
      </div>
    </div>
  );
}

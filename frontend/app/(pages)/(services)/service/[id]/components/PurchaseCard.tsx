"use client";

import { IService } from "@/app/types/service";

interface PurchaseCardProps {
  service: IService | null;
  handleAddToCart: () => void;
  addedToCart: boolean;
  loading: boolean;
}

export default function PurchaseCard({
  service,
  handleAddToCart,
  addedToCart,
  loading,
}: PurchaseCardProps) {
  return (
    <div className="mt-8 rounded-2xl border border-white/8 bg-white/3 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/40">Starting at</p>

          <p className="mt-1 text-3xl font-bold text-white">
            ${service?.price}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-white/40">Delivery</p>

          <p className="mt-1 font-semibold text-white">
            {service?.deliveryDays} days
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={loading || addedToCart}
        className="mt-6 w-full rounded-xl bg-brand-green px-6 py-3.5 font-semibold text-brand-navy shadow-[0_0_35px_rgba(0,220,130,0.1)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_45px_rgba(0,220,130,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? "Adding..."
          : addedToCart
            ? "Added to Cart ✓"
            : "Add to Cart"}
      </button>
    </div>
  );
}

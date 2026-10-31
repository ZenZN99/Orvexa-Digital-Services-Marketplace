"use client";

import { ICartItem } from "@/app/types/cart-item";
import { ArrowRight } from "lucide-react";

interface OrderSummaryProps {
  cartItems: ICartItem[];
  total: number;
  handlePlaceOrder: () => void;
  loading: boolean;
}

export default function OrderSummary({
  cartItems,
  total,
  handlePlaceOrder,
  loading,
}: OrderSummaryProps) {
  return (
    <aside className="h-fit rounded-2xl border border-white/8 bg-white/2.5 p-5">
      <h2 className="text-lg font-semibold text-white">Order Summary</h2>

      <div className="mt-5 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-white/40">Services</span>

          <span className="text-white/70">{cartItems.length}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-white/40">Subtotal</span>

          <span className="text-white/70">${total}</span>
        </div>

        <div className="border-t border-white/8 pt-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white">Total</span>

            <span className="text-2xl font-bold text-brand-green">
              ${total}
            </span>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={handlePlaceOrder}
        disabled={loading}
        className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-green text-sm font-bold text-brand-navy transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Creating Order..." : "Place Order"}
        <ArrowRight size={16} />
      </button>
    </aside>
  );
}

"use client";

import { ICartItem } from "@/app/types/cart-item";
import { ShoppingBag } from "lucide-react";

interface HeaderProps {
  cartItems: ICartItem[];
  clearCart: () => void;
  loading: {
    clearing: boolean;
  };
}

export default function Header({ cartItems, clearCart, loading }: HeaderProps) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <ShoppingBag size={24} className="text-brand-green" />

          <h1 className="text-3xl font-bold text-white">Your Cart</h1>
        </div>

        <p className="mt-2 text-sm text-white/40">
          {cartItems.length} {cartItems.length === 1 ? "service" : "services"}{" "}
          in your cart
        </p>
      </div>

      {cartItems.length > 0 && (
        <button
          type="button"
          onClick={clearCart}
          disabled={loading.clearing}
          className="text-sm font-medium text-red-400 transition hover:text-red-300 disabled:opacity-50"
        >
          {loading.clearing ? "Clearing..." : "Clear Cart"}
        </button>
      )}
    </div>
  );
}

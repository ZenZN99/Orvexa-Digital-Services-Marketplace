"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ICart } from "../types/cart";
import { cartsApi } from "../apis/cart";

interface LoadingState {
  global: boolean;
  adding: Record<string, boolean>;
  removing: Record<string, boolean>;
  clearing: boolean;
}

export const useCarts = () => {
  const [cart, setCart] = useState<ICart | null>(null);

  const [loading, setLoading] = useState<LoadingState>({
    global: false,
    adding: {},
    removing: {},
    clearing: false,
  });

  const fetchCart = useCallback(async () => {
    setLoading((p) => ({
      ...p,
      global: true,
    }));

    try {
      const res = await cartsApi.findMe();

      setCart(res.data);

      return res.data;
    } catch {
      return null;
    } finally {
      setLoading((p) => ({
        ...p,
        global: false,
      }));
    }
  }, []);

  const addItem = async (serviceId: string) => {
    setLoading((p) => ({
      ...p,
      adding: {
        ...p.adding,
        [serviceId]: true,
      },
    }));

    try {
      const res = await cartsApi.addItem(serviceId);

      setCart(res.data);

      toast.success("Service added to cart successfully");

      return res.data;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to add service to cart",
      );

      return null;
    } finally {
      setLoading((p) => {
        const { [serviceId]: _, ...rest } = p.adding;

        return {
          ...p,
          adding: rest,
        };
      });
    }
  };

  const removeItem = async (serviceId: string) => {
    setLoading((p) => ({
      ...p,
      removing: {
        ...p.removing,
        [serviceId]: true,
      },
    }));

    try {
      const res = await cartsApi.removeItem(serviceId);

      setCart(res.data);

      toast.success("Service removed from cart successfully");

      return res.data;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to remove service from cart",
      );

      return null;
    } finally {
      setLoading((p) => {
        const { [serviceId]: _, ...rest } = p.removing;

        return {
          ...p,
          removing: rest,
        };
      });
    }
  };

  const clearCart = async () => {
    setLoading((p) => ({
      ...p,
      clearing: true,
    }));

    try {
      const res = await cartsApi.clearCart();

      setCart(res.data);

      toast.success("Cart cleared successfully");

      return res.data;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to clear cart",
      );

      return null;
    } finally {
      setLoading((p) => ({
        ...p,
        clearing: false,
      }));
    }
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const refresh = () => {
    fetchCart();
  };

  return {
    // data
    cart,

    // loading
    loading,

    // fetch
    fetchCart,
    refresh,

    // actions
    addItem,
    removeItem,
    clearCart,
  };
};

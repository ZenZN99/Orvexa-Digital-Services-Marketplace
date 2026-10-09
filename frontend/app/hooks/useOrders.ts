"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ordersApi } from "../apis/orders";
import { IOrder } from "../types/order";

interface LoadingState {
  global: boolean;
  creating: boolean;
  deleting: boolean;
}

export const useOrders = (initialPage: number = 1, limit: number = 10) => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [myOrders, setMyOrders] = useState<IOrder[]>([]);
  const [order, setOrder] = useState<IOrder | null>(null);

  const [page, setPage] = useState(initialPage);

  const [pagination, setPagination] = useState({
    page: initialPage,
    limit,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [loading, setLoading] = useState<LoadingState>({
    global: false,
    creating: false,
    deleting: false,
  });

  const fetchOrders = useCallback(async () => {
    setLoading((p) => ({
      ...p,
      global: true,
    }));

    try {
      const res = await ordersApi.findAll(page, limit);

      setOrders(Array.isArray(res.data.orders) ? res.data.orders : []);

      setPagination(res.data.pagination);

      return res.data.orders;
    } catch {
      return [];
    } finally {
      setLoading((p) => ({
        ...p,
        global: false,
      }));
    }
  }, [page, limit]);

  const fetchMyOrders = async () => {
    try {
      const res = await ordersApi.findMe();

      setMyOrders(Array.isArray(res.data) ? res.data : []);

      return res.data;
    } catch {
      return [];
    }
  };

  const fetchOrderById = async (orderId: string) => {
    try {
      const res = await ordersApi.findOne(orderId);

      setOrder(res.data);

      return res.data;
    } catch {
      return null;
    }
  };

  const createOrder = async () => {
    setLoading((p) => ({
      ...p,
      creating: true,
    }));

    try {
      const res = await ordersApi.create();

      toast.success("Order created successfully");

      setOrder(res.data);

      return res.data;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create order",
      );

      return null;
    } finally {
      setLoading((p) => ({
        ...p,
        creating: false,
      }));
    }
  };

  const deleteOrder = async (orderId: string) => {
    setLoading((p) => ({
      ...p,
      deleting: true,
    }));

    try {
      await ordersApi.destroy(orderId);

      setOrders((prev) => prev.filter((item) => item.id !== orderId));

      setMyOrders((prev) => prev.filter((item) => item.id !== orderId));

      setOrder((prev) => (prev?.id === orderId ? null : prev));

      setPagination((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }));

      toast.success("Order deleted successfully");

      return true;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete order",
      );

      return false;
    } finally {
      setLoading((p) => ({
        ...p,
        deleting: false,
      }));
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const refresh = () => {
    fetchOrders();
  };

  return {
    // data
    orders,
    myOrders,
    order,

    pagination,
    page,
    setPage,

    // loading
    loading,

    // fetch
    fetchOrders,
    fetchMyOrders,
    fetchOrderById,
    refresh,

    // actions
    createOrder,
    deleteOrder,
  };
};

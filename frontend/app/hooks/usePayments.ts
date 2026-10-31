"use client";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { paymentsApi } from "../apis/payments";
import { IPayment } from "../types/payment";

interface LoadingState {
  global: boolean;
  paying: boolean;
  recharging: boolean;
}

export const usePayments = (initialPage: number = 1, limit: number = 10) => {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [myPayments, setMyPayments] = useState<IPayment[]>([]);
  const [payment, setPayment] = useState<IPayment | null>(null);

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
    paying: false,
    recharging: false,
  });

  const fetchPayments = useCallback(async () => {
    setLoading((p) => ({
      ...p,
      global: true,
    }));

    try {
      const res = await paymentsApi.findAll(page, limit);

      setPayments(Array.isArray(res.data.payments) ? res.data.payments : []);

      setPagination(res.data.pagination);

      return res.data.payments;
    } catch {
      return [];
    } finally {
      setLoading((p) => ({
        ...p,
        global: false,
      }));
    }
  }, [page, limit]);

  const fetchMyPayments = async () => {
    try {
      const res = await paymentsApi.findMe();

      setMyPayments(Array.isArray(res.data) ? res.data : []);

      return res.data;
    } catch {
      return [];
    }
  };

  const fetchPaymentById = async (paymentId: string) => {
    try {
      const res = await paymentsApi.findOne(paymentId);

      setPayment(res.data);

      return res.data;
    } catch {
      return null;
    }
  };

  const payOrder = async (orderId: string) => {
    setLoading((p) => ({
      ...p,
      paying: true,
    }));

    try {
      const res = await paymentsApi.pay(orderId);

      toast.success("Payment completed successfully");

      return res.data;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to complete payment",
      );

      return null;
    } finally {
      setLoading((p) => ({
        ...p,
        paying: false,
      }));
    }
  };

  const rechargeBalance = async (amount: number) => {
    setLoading((p) => ({
      ...p,
      recharging: true,
    }));

    try {
      const res = await paymentsApi.rechargeBalance(amount);

      toast.success("Balance recharged successfully");

      return res.data;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to recharge balance",
      );

      return null;
    } finally {
      setLoading((p) => ({
        ...p,
        recharging: false,
      }));
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const refresh = () => {
    fetchPayments();
  };

  return {
    // data
    payments,
    myPayments,
    payment,

    pagination,
    page,
    setPage,

    // loading
    loading,

    // fetch
    fetchPayments,
    fetchMyPayments,
    fetchPaymentById,
    refresh,

    // actions
    payOrder,
    rechargeBalance,
  };
};

"use client";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { platformWalletsApi } from "../apis/platform-wallets";

interface LoadingState {
  global: boolean;
  withdrawing: boolean;
}

export const usePlatformWallets = () => {
  const [balance, setBalance] = useState<number>(0);

  const [loading, setLoading] = useState<LoadingState>({
    global: false,
    withdrawing: false,
  });

  const fetchBalance = useCallback(async () => {
    setLoading((p) => ({
      ...p,
      global: true,
    }));

    try {
      const res = await platformWalletsApi.findBalance();

      setBalance(res.data.balance ?? 0);

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

  const withdraw = async (amount: number) => {
    setLoading((p) => ({
      ...p,
      withdrawing: true,
    }));

    try {
      const res = await platformWalletsApi.withdraw(amount);

      toast.success("Withdrawal completed successfully");

      await fetchBalance();

      return res.data;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to withdraw",
      );

      return null;
    } finally {
      setLoading((p) => ({
        ...p,
        withdrawing: false,
      }));
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const refresh = () => {
    fetchBalance();
  };

  return {
    // data
    balance,

    // loading
    loading,

    // fetch
    fetchBalance,
    refresh,

    // actions
    withdraw,
  };
};

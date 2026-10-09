"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { contractsApi } from "../apis/contracts";
import { IContract } from "../types/contract";

interface LoadingState {
  global: boolean;
  completing: Record<string, boolean>;
  delivering: Record<string, boolean>;
}

export const useContracts = (initialPage: number = 1, limit: number = 10) => {
  const [contracts, setContracts] = useState<IContract[]>([]);
  const [myContracts, setMyContracts] = useState<IContract[]>([]);
  const [contract, setContract] = useState<IContract | null>(null);

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
    completing: {},
    delivering: {},
  });

  const fetchContracts = useCallback(async () => {
    setLoading((p) => ({
      ...p,
      global: true,
    }));

    try {
      const res = await contractsApi.findAll(page, limit);

      setContracts(Array.isArray(res.data.contracts) ? res.data.contracts : []);

      setPagination(res.data.pagination);

      return res.data.contracts;
    } catch {
      return [];
    } finally {
      setLoading((p) => ({
        ...p,
        global: false,
      }));
    }
  }, [page, limit]);

  const fetchMyContracts = async () => {
    try {
      const res = await contractsApi.findMe();

      setMyContracts(Array.isArray(res.data) ? res.data : []);

      return res.data;
    } catch {
      return [];
    }
  };

  const fetchContractById = async (contractId: string) => {
    try {
      const res = await contractsApi.findOne(contractId);

      setContract(res.data);

      return res.data;
    } catch {
      return null;
    }
  };

  const completeContract = async (contractId: string) => {
    setLoading((p) => ({
      ...p,
      completing: {
        ...p.completing,
        [contractId]: true,
      },
    }));

    try {
      const res = await contractsApi.complete(contractId);

      toast.success("Contract completed successfully");

      return res.data;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to complete contract",
      );

      return null;
    } finally {
      setLoading((p) => {
        const { [contractId]: _, ...rest } = p.completing;

        return {
          ...p,
          completing: rest,
        };
      });
    }
  };

  const deliverContract = async (contractId: string) => {
    setLoading((p) => ({
      ...p,
      delivering: {
        ...p.delivering,
        [contractId]: true,
      },
    }));

    try {
      const res = await contractsApi.deliver(contractId);

      toast.success("Contract delivered successfully");

      return res.data;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to deliver contract",
      );

      return null;
    } finally {
      setLoading((p) => {
        const { [contractId]: _, ...rest } = p.delivering;

        return {
          ...p,
          delivering: rest,
        };
      });
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const refresh = () => {
    fetchContracts();
  };

  return {
    // data
    contracts,
    myContracts,
    contract,

    pagination,
    page,
    setPage,

    // loading
    loading,

    // fetch
    fetchContracts,
    fetchMyContracts,
    fetchContractById,
    refresh,

    // actions
    completeContract,
    deliverContract,
  };
};

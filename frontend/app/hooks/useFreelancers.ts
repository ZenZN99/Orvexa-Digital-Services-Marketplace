"use client";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FreelancerData, freelancersApi } from "../apis/freelancers";
import { IFreelancer } from "../types/freelancer";

interface LoadingState {
  global: boolean;
  updating: boolean;
}

export const useFreelancers = () => {
  const [myFreelancer, setMyFreelancer] = useState<IFreelancer | null>(null);
  const [freelancer, setFreelancer] = useState<IFreelancer | null>(null);

  const [loading, setLoading] = useState<LoadingState>({
    global: false,
    updating: false,
  });

  const fetchMyFreelancer = useCallback(async () => {
    setLoading((p) => ({
      ...p,
      global: true,
    }));

    try {
      const res = await freelancersApi.findMe();

      setMyFreelancer(res.data);

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

  const fetchFreelancerById = useCallback(async (userId: string) => {
    try {
      const res = await freelancersApi.findOne(userId);

      setFreelancer(res.data);

      return res.data;
    } catch (error) {
      return null;
    }
  }, []);

  const updateFreelancer = async (data: FreelancerData) => {
    setLoading((p) => ({
      ...p,
      updating: true,
    }));

    try {
      const res = await freelancersApi.update(data);

      setMyFreelancer(res.data);

      toast.success("Freelancer profile updated successfully");

      return res.data;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update freelancer profile",
      );

      return null;
    } finally {
      setLoading((p) => ({
        ...p,
        updating: false,
      }));
    }
  };

  useEffect(() => {
    fetchMyFreelancer();
  }, [fetchMyFreelancer]);

  const refresh = () => {
    fetchMyFreelancer();
  };

  return {
    // data
    myFreelancer,
    freelancer,

    // loading
    loading,

    // fetch
    fetchMyFreelancer,
    fetchFreelancerById,
    refresh,

    // actions
    updateFreelancer,
  };
};

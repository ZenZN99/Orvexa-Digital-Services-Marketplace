"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  IUserVerification,
  UserVerificationStatus,
} from "../types/user-verification";
import { userVerificationsApi } from "../apis/user-verifications";

interface LoadingState {
  global: boolean;
  creating: boolean;
  tryingAgain: boolean;
  updatingStatus: Record<string, boolean>;
}

export const useUserVerifications = (
  initialPage: number = 1,
  limit: number = 10,
) => {
  const [verifications, setVerifications] = useState<IUserVerification[]>([]);

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
    tryingAgain: false,
    updatingStatus: {},
  });

  const fetchPendingVerifications = useCallback(async () => {
    setLoading((p) => ({
      ...p,
      global: true,
    }));

    try {
      const res = await userVerificationsApi.findPending(page, limit);

      setVerifications(
        Array.isArray(res.data.verifications) ? res.data.verifications : [],
      );

      setPagination(res.data.pagination);

      return res.data.verifications;
    } catch {
      return [];
    } finally {
      setLoading((p) => ({
        ...p,
        global: false,
      }));
    }
  }, [page, limit]);

  const createVerification = async (
    profileImage: File,
    identityDocument: File,
  ) => {
    setLoading((p) => ({
      ...p,
      creating: true,
    }));

    try {
      const res = await userVerificationsApi.create(
        profileImage,
        identityDocument,
      );

      toast.success("Verification submitted successfully");

      return res.data;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to submit verification",
      );

      return null;
    } finally {
      setLoading((p) => ({
        ...p,
        creating: false,
      }));
    }
  };

  const tryAgainVerification = async () => {
    setLoading((p) => ({
      ...p,
      tryingAgain: true,
    }));

    try {
      const res = await userVerificationsApi.tryAgain();

      toast.success("You can submit your verification again");

      return res.data;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to retry verification",
      );

      return null;
    } finally {
      setLoading((p) => ({
        ...p,
        tryingAgain: false,
      }));
    }
  };

  const updateVerificationStatus = async (
    verificationId: string,
    status: UserVerificationStatus,
    rejectionReason?: string,
  ) => {
    const snapshot = verifications;

    setLoading((p) => ({
      ...p,
      updatingStatus: {
        ...p.updatingStatus,
        [verificationId]: true,
      },
    }));

    setVerifications((prev) =>
      prev.map((item) =>
        item.id === verificationId
          ? {
              ...item,
              status,
              ...(rejectionReason && { rejectionReason }),
            }
          : item,
      ),
    );

    try {
      const res = await userVerificationsApi.updateStatus(
        verificationId,
        status,
        rejectionReason,
      );

      toast.success("Verification status updated successfully");

      return res.data;
    } catch (error: any) {
      setVerifications(snapshot);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update verification status",
      );

      return null;
    } finally {
      setLoading((p) => {
        const { [verificationId]: _, ...rest } = p.updatingStatus;

        return {
          ...p,
          updatingStatus: rest,
        };
      });
    }
  };

  useEffect(() => {
    fetchPendingVerifications();
  }, [fetchPendingVerifications]);

  const refresh = () => {
    fetchPendingVerifications();
  };

  return {
    // data
    verifications,
    pagination,
    page,
    setPage,

    // loading
    loading,

    // fetch
    fetchPendingVerifications,
    refresh,

    // actions
    createVerification,
    tryAgainVerification,
    updateVerificationStatus,
  };
};

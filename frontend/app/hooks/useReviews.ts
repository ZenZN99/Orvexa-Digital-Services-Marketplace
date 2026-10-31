"use client";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ReviewData, reviewsApi } from "../apis/reviews";
import { IReview } from "../types/review";

interface LoadingState {
  global: boolean;
  creating: boolean;
}

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "object" && error !== null && "message" in error) {
    const { message } = error as { message: unknown };

    if (typeof message === "string" && message) {
      return message;
    }
  }

  return fallback;
};

export const useReviews = (
  serviceId?: string,
  initialPage: number = 1,
  limit: number = 10,
) => {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [myReviews, setMyReviews] = useState<IReview[]>([]);
  const [freelancerReviews, setFreelancerReviews] = useState<IReview[]>([]);
  const [review, setReview] = useState<IReview | null>(null);

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
  });

  const fetchMyReviews = useCallback(async () => {
    setLoading((p) => ({
      ...p,
      global: true,
    }));

    try {
      const res = await reviewsApi.findMe(page, limit);

      const list = Array.isArray(res.data.reviews) ? res.data.reviews : [];

      setMyReviews(list);

      setPagination(res.data.pagination);

      return list;
    } catch {
      return [];
    } finally {
      setLoading((p) => ({
        ...p,
        global: false,
      }));
    }
  }, [page, limit]);

  const fetchReviewsByService = useCallback(async () => {
    if (!serviceId) {
      return [];
    }

    setLoading((p) => ({
      ...p,
      global: true,
    }));

    try {
      const res = await reviewsApi.findAllByService(serviceId, page, limit);

      const list = Array.isArray(res.data.reviews) ? res.data.reviews : [];

      setReviews(list);

      setPagination(res.data.pagination);

      return list;
    } catch {
      return [];
    } finally {
      setLoading((p) => ({
        ...p,
        global: false,
      }));
    }
  }, [serviceId, page, limit]);

  const fetchReviewsByFreelancer = useCallback(
    async (freelancerId: string) => {
      setLoading((p) => ({
        ...p,
        global: true,
      }));

      try {
        const res = await reviewsApi.findByFreelancer(
          freelancerId,
          page,
          limit,
        );

        const list = Array.isArray(res.data.reviews) ? res.data.reviews : [];

        setFreelancerReviews(list);

        setPagination(res.data.pagination);

        return list;
      } catch {
        return [];
      } finally {
        setLoading((p) => ({
          ...p,
          global: false,
        }));
      }
    },
    [page, limit],
  );

  const fetchReviewById = async (reviewId: string) => {
    try {
      const res = await reviewsApi.findOne(reviewId);

      setReview(res.data);

      return res.data;
    } catch {
      return null;
    }
  };

  const createReview = async (contractId: string, data: ReviewData) => {
    setLoading((p) => ({
      ...p,
      creating: true,
    }));

    try {
      const payload: ReviewData = {
        ...data,
        comment: data.comment?.trim() ? data.comment : null,
      };

      const res = await reviewsApi.create(contractId, payload);

      toast.success("Review created successfully");

      if (serviceId) {
        await fetchReviewsByService();
      }

      return res.data;
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to create review"));

      return null;
    } finally {
      setLoading((p) => ({
        ...p,
        creating: false,
      }));
    }
  };

  useEffect(() => {
    fetchReviewsByService();
  }, [fetchReviewsByService]);

  const refresh = () => {
    fetchReviewsByService();
  };

  return {
    // data
    reviews,
    myReviews,
    freelancerReviews,
    review,

    pagination,
    page,
    setPage,

    // loading
    loading,

    // fetch
    fetchReviewsByService,
    fetchMyReviews,
    fetchReviewsByFreelancer,
    fetchReviewById,
    refresh,

    // actions
    createReview,
  };
};

"use client";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ReviewData, reviewsApi } from "../apis/reviews";
import { IReview } from "../types/review";

interface LoadingState {
  global: boolean;
  creating: boolean;
}

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

      setMyReviews(Array.isArray(res.data.reviews) ? res.data.reviews : []);

      setPagination(res.data.pagination);

      return res.data.reviews;
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

      setReviews(Array.isArray(res.data.reviews) ? res.data.reviews : []);

      setPagination(res.data.pagination);

      return res.data.reviews;
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

        setFreelancerReviews(
          Array.isArray(res.data.reviews) ? res.data.reviews : [],
        );

        setPagination(res.data.pagination);

        return res.data.reviews;
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
      const res = await reviewsApi.create(contractId, data);

      toast.success("Review created successfully");

      return res.data;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create review",
      );

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

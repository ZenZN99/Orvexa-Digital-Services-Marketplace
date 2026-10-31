"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useContracts } from "@/app/hooks/useContracts";
import { useReviews } from "@/app/hooks/useReviews";
import { useAuthStore } from "@/app/stores/useAuthStore";
import { ContractStatus } from "@/app/types/contract";
import Back from "./components/Back";
import Header from "./components/Header";
import Freelancer from "./components/Freelancer";
import Service from "./components/Service";
import Review from "./components/Review";
import ProtectedRoute from "@/app/config/routes/ProtectedRoute";
import { UserRole } from "@/app/types/user";
import Skeleton from "./components/Skeleton";
import ContractNotFound from "./components/ContractNotFound";

export default function ReviewPage() {
  const params = useParams<{ id: string }>();
  const contractId = params.id;

  const { currentUser } = useAuthStore();

  const { contract, fetchContractById } = useContracts();
  const [contractLoading, setContractLoading] = useState(true);

  const serviceId = contract?.serviceId;

  const {
    reviews,
    loading: reviewsLoading,
    createReview,
  } = useReviews(serviceId, 1, 100);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [justSubmitted, setJustSubmitted] = useState(false);

  useEffect(() => {
    if (!contractId) return;

    setContractLoading(true);

    fetchContractById(contractId).finally(() => setContractLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractId]);

  // Find an existing review the current client already left for this exact contract.
  const existingReview = useMemo(() => {
    if (!currentUser) return null;

    return (
      reviews.find(
        (review) =>
          review.contractId === contractId &&
          review.clientId === currentUser.id,
      ) || null
    );
  }, [reviews, contractId, currentUser]);

  if (contractLoading || !currentUser) {
    return <Skeleton />;
  }

  if (!contract) {
    return <ContractNotFound />;
  }

  const freelancerUser = contract.freelancer?.user;
  const avatarUrl = freelancerUser?.profile?.avatar?.url;
  const freelancerName = freelancerUser
    ? `${freelancerUser.firstName} ${freelancerUser.lastName}`
    : "Freelancer";
  const freelancerId = contract.freelancer.user.id;

  const alreadyReviewed = Boolean(existingReview) || justSubmitted;
  const notCompleted = contract.status !== ContractStatus.COMPLETED;

  const displayRating = existingReview?.rating ?? rating;
  const displayComment = existingReview?.comment ?? comment;

  const handleSubmit = async () => {
    if (rating === 0) return;

    const result = await createReview(contractId, {
      rating,
      comment: comment.trim(),
    });

    if (result) {
      setJustSubmitted(true);
    }
  };

  return (
    <ProtectedRoute roles={[UserRole.CLIENT]}>
      <main className="min-h-screen bg-brand-navy px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-3xl">
          <Back />

          <Header
            alreadyReviewed={alreadyReviewed}
            notCompleted={notCompleted}
          />

          <Freelancer
            avatarUrl={avatarUrl}
            freelancerId={freelancerId}
            freelancerName={freelancerName}
            contract={contract}
          />

          <Service contract={contract} />

          <Review
            alreadyReviewed={alreadyReviewed}
            notCompleted={notCompleted}
            rating={rating}
            comment={comment}
            setRating={setRating}
            setComment={setComment}
            displayRating={displayRating}
            displayComment={displayComment}
            handleSubmit={handleSubmit}
            reviewsLoading={reviewsLoading}
          />
        </div>
      </main>
    </ProtectedRoute>
  );
}

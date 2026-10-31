"use client";

import { CheckCircle2, Loader2, Star } from "lucide-react";
import Link from "next/link";

interface ReviewProps {
  alreadyReviewed: boolean;
  notCompleted: boolean;

  rating: number;
  comment: string;

  setRating: (val: number) => void;
  setComment: (val: string) => void;

  displayRating: number;
  displayComment: string | null;

  handleSubmit: () => void;

  reviewsLoading: {
    creating: boolean;
  };
}

export default function Review({
  alreadyReviewed,
  notCompleted,
  rating,
  comment,
  setRating,
  setComment,
  displayRating,
  displayComment,
  handleSubmit,
  reviewsLoading,
}: ReviewProps) {
  return (
    <div className="mt-4 rounded-2xl border border-white/[0.07] bg-white/2.5 p-5 sm:p-6">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wider text-white/25">
          Your Review
        </p>

        <h2 className="mt-2 text-lg font-semibold text-white">
          {alreadyReviewed ? "What you shared" : "How was your experience?"}
        </h2>

        {!alreadyReviewed && !notCompleted && (
          <p className="mt-1 text-sm text-white/35">
            Rate the service you received from this freelancer.
          </p>
        )}
      </div>

      {/* Rating */}
      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-white/70">Rating</p>

        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              disabled={alreadyReviewed || notCompleted}
              onClick={() => setRating(value)}
              className="rounded-lg p-1 transition hover:scale-110 disabled:cursor-not-allowed disabled:hover:scale-100"
              aria-label={`Rate ${value} stars`}
            >
              <Star
                size={28}
                fill={value <= displayRating ? "currentColor" : "none"}
                className={
                  value <= displayRating ? "text-brand-green" : "text-white/15"
                }
              />
            </button>
          ))}
        </div>

        <p className="mt-2 text-xs text-white/25">
          {displayRating === 0
            ? "Select a rating"
            : `${displayRating} out of 5 stars`}
        </p>
      </div>

      {/* Comment */}
      <div className="mt-7">
        <label
          htmlFor="review-comment"
          className="text-sm font-medium text-white/70"
        >
          Comment
        </label>

        <textarea
          id="review-comment"
          value={displayComment ?? ""}
          onChange={(event) => setComment(event.target.value)}
          disabled={alreadyReviewed || notCompleted}
          placeholder="Tell us about your experience..."
          rows={5}
          maxLength={1000}
          className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/3 px-4 py-3 text-sm leading-6 text-white outline-none transition disabled:opacity-60"
        />

        {!alreadyReviewed && !notCompleted && (
          <div className="mt-2 flex justify-end">
            <span className="text-[11px] text-white/20">
              {comment.length}/1000
            </span>
          </div>
        )}
      </div>

      {/* Submit / Notice */}
      {!alreadyReviewed && !notCompleted && (
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/contracts"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 px-5 text-sm font-semibold text-white/50 transition hover:bg-white/4 hover:text-white"
          >
            Cancel
          </Link>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={rating === 0 || reviewsLoading.creating}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-green px-6 text-sm font-bold text-brand-navy transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {reviewsLoading.creating ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Star size={16} fill="currentColor" />
            )}

            {reviewsLoading.creating ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}

      {alreadyReviewed && (
        <div className="mt-6 rounded-xl border border-brand-green/15 bg-brand-green/5 px-4 py-3">
          <p className="text-center text-xs leading-5 text-white/40">
            Your review has been submitted successfully and is now visible on
            the freelancer&apos;s service and profile.
          </p>
        </div>
      )}
    </div>
  );
}

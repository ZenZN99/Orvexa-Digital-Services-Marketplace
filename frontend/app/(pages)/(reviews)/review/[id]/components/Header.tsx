"use client";

import { CheckCircle2, Lock } from "lucide-react";

interface HeaderProps {
  alreadyReviewed: boolean;
  notCompleted: boolean;
}

export default function Header({ alreadyReviewed, notCompleted }: HeaderProps) {
  return (
    <div className="mb-8">
      <div
        className={`mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${
          alreadyReviewed
            ? "text-brand-green"
            : notCompleted
              ? "text-yellow-300"
              : "text-brand-green"
        }`}
      >
        {alreadyReviewed ? (
          <>
            <CheckCircle2 size={15} />
            Review Submitted
          </>
        ) : notCompleted ? (
          <>
            <Lock size={15} />
            Contract Not Completed
          </>
        ) : (
          <>
            <CheckCircle2 size={15} />
            Service Completed
          </>
        )}
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {alreadyReviewed
          ? "You already reviewed this contract"
          : notCompleted
            ? "This contract isn't completed yet"
            : "Review your experience"}
      </h1>

      <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
        {alreadyReviewed
          ? "Thanks for your feedback. Here's what you submitted for this contract."
          : notCompleted
            ? "You can leave a review only after the freelancer delivers and the contract is marked as completed."
            : "Your feedback helps other clients discover great freelancers and helps freelancers improve their services."}
      </p>
    </div>
  );
}

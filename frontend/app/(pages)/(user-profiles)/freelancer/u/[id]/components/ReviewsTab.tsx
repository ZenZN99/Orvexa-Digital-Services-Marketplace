"use client";

import { ExternalLink, Star } from "lucide-react";
import RatingStars from "../../../components/RatingStars";
import { Tab } from "../../../page";
import { IUser } from "@/app/types/user";
import { IFreelancer } from "@/app/types/freelancer";
import { IReview } from "@/app/types/review";
import Link from "next/link";

interface ReviewsTabProps {
  activeTab: Tab;
  user: IUser | null;
  freelancer: IFreelancer | null;
  freelancerReviews: IReview[];
}

export default function ReviewsTab({
  activeTab,
  user,
  freelancer,
  freelancerReviews,
}: ReviewsTabProps) {
  return (
    <div>
      {activeTab === "reviews" && (
        <section className="mt-6">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">
              Client feedback
            </p>

            <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Reviews from clients</h2>

                <p className="mt-2 text-sm text-white/40">
                  What clients say about working with {user?.firstName}.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/2.5 px-4 py-3">
                <Star size={20} className="fill-brand-green text-brand-green" />

                <div>
                  <p className="text-lg font-semibold">
                    {freelancer?.ratingAverage}
                  </p>
                  <p className="text-xs text-white/35">
                    {freelancer?.ratingCount} reviews
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {freelancerReviews.map((review) => (
              <article
                key={review.id}
                className="rounded-[1.75rem] border border-white/8 bg-white/2.5 p-6 backdrop-blur-xl transition hover:border-white/8 sm:p-7"
              >
                <div className="flex flex-col gap-5 sm:flex-row">
                  {/* Client */}
                  <div className="flex shrink-0 items-start gap-3 sm:w-56">
                    {review.client?.profile?.avatar?.url ? (
                      <Link href={`/profile/u/${review.clientId}`}>
                        <img
                          src={review.client.profile.avatar.url}
                          alt={`${review.client.firstName} ${review.client.lastName}`}
                          className="h-12 w-12 rounded-xl object-cover transition-all duration-300 hover:scale-110"
                        />
                      </Link>
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 text-sm font-semibold text-white/30">
                        {review.client?.firstName?.charAt(0)}
                        {review.client?.lastName?.charAt(0)}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {review.client?.firstName} {review.client?.lastName}
                      </p>

                      <p className="mt-1 text-xs text-white/30">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString()
                          : ""}
                      </p>

                      <div className="mt-2">
                        <RatingStars rating={review.rating} size={13} />
                      </div>
                    </div>
                  </div>

                  {/* Review */}
                  <div className="flex-1 sm:border-l sm:border-white/6 sm:pl-6">
                    <p className="text-[15px] leading-7 text-white/60">
                      &ldquo;{review.comment || "No comment provided."}&rdquo;
                    </p>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.12em] text-white/25">
                          Completed service
                        </p>

                        <p className="mt-1 text-sm font-medium text-white/70">
                          {review.service?.title}
                        </p>
                      </div>

                      <Link
                        href={`/service/${review.serviceId}`}
                        className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/4 px-4 text-xs font-semibold text-white/60 transition hover:border-brand-green/20 hover:bg-brand-green/8 hover:text-brand-green"
                      >
                        View completed service
                        <ExternalLink size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

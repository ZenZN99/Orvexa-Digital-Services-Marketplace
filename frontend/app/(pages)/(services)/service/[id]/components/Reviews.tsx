"use client";

import { useEffect, useState } from "react";
import { IReview } from "@/app/types/review";
import { IService } from "@/app/types/service";
import { IUser } from "@/app/types/user";
import { useUsers } from "@/app/hooks/useUsers";
import { usePresenceStore } from "@/app/stores/usePresenceStore";
import Link from "next/link";

interface ReviewsProps {
  service: IService | null;
  reviews: IReview[];
  loading?: boolean;
}

export default function Reviews({ service, reviews, loading }: ReviewsProps) {
  const { fetchUserById } = useUsers();

  const [clients, setClients] = useState<Record<string, IUser | null>>({});

  const onlineUserIds = usePresenceStore((state) => state.onlineUserIds);

  useEffect(() => {
    const missingIds = Array.from(
      new Set(reviews.map((review) => review.clientId)),
    ).filter((id) => !(id in clients));

    if (missingIds.length === 0) return;

    missingIds.forEach(async (id) => {
      const user = await fetchUserById(id);
      setClients((prev) => ({ ...prev, [id]: user }));
    });
  }, [reviews]);

  return (
    <section className="mt-16 border-t border-white/8 pt-12">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Client Reviews</h2>

          <p className="mt-2 text-white/40">
            See what clients say about this service.
          </p>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">
              {service?.ratingAverage != null
                ? Number(service.ratingAverage).toFixed(1)
                : "—"}
            </span>

            <span className="text-xl text-yellow-400">★</span>
          </div>

          <p className="text-sm text-white/40">
            {service?.ratingCount ?? 0} reviews
          </p>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-2xl border border-white/8 bg-white/3"
            />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-white/15 p-10 text-center">
          <p className="font-medium text-white/70">No reviews yet</p>

          <p className="mt-2 text-sm text-white/40">
            Be the first client to review this service.
          </p>
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-white/8">
          {reviews.map((review) => {
            const client = clients[review.clientId];
            const clientName = client
              ? `${client.firstName} ${client.lastName}`
              : "Client";
            const avatarUrl = client?.profile?.avatar?.url;

            const isOnline = client ? onlineUserIds.includes(client.id) : false;

            return (
              <article key={review.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="group/avatar relative h-11 w-11 shrink-0">
                      {avatarUrl ? (
                        <Link href={`/profile/u/${client.id}`}>
                          <img
                            src={avatarUrl}
                            alt={clientName}
                            className="h-11 w-11 rounded-full object-cover transition-all duration-300 hover:scale-110"
                          />
                        </Link>
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/6 font-semibold text-white/70">
                          {clientName.charAt(0).toUpperCase()}
                        </div>
                      )}

                      {isOnline && (
                        <>
                          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-brand-navy bg-brand-green shadow-[0_0_8px_rgba(0,220,130,0.45)]" />

                          <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-brand-navy px-2.5 py-1.5 text-[10px] font-medium text-white opacity-0 shadow-xl transition-opacity duration-200 group-hover/avatar:opacity-100">
                            Online
                          </span>
                        </>
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold text-white">{clientName}</h3>

                      <p className="text-sm text-white/40">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString()
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-0.5 text-yellow-400">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span
                        key={index}
                        className={
                          index < review.rating
                            ? "text-yellow-400"
                            : "text-white/15"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                {review.comment && (
                  <p className="mt-4 leading-7 text-white/50">
                    {review.comment}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

"use client";

import Link from "next/link";
import { Clock3, UserRound } from "lucide-react";
import { IOrder } from "@/app/types/order";
import { usePresenceStore } from "@/app/stores/usePresenceStore";

interface ServicesProps {
  services: IOrder["services"];
}

export default function Services({ services }: ServicesProps) {
  const onlineUserIds = usePresenceStore((state) => state.onlineUserIds);

  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Order Items</h2>

          <p className="mt-1 text-xs text-white/35">
            {services.length} {services.length === 1 ? "service" : "services"}{" "}
            in this order
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {services.map((service) => {
          const firstImage = service.images?.[0]?.url;
          const freelancerUser = service.freelancer?.user;

          const isOnline = freelancerUser
            ? onlineUserIds.includes(freelancerUser.id)
            : false;

          return (
            <article
              key={service.id}
              className="overflow-hidden rounded-2xl border border-white/8 bg-white/2.5"
            >
              {/* Service Image */}
              <div className="relative aspect-[2.4/1] overflow-hidden bg-white/5 sm:aspect-3/1">
                {firstImage ? (
                  <img
                    src={firstImage}
                    alt={service.title}
                    className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-white/20">
                    No image
                  </div>
                )}

                <div className="absolute inset-0 bg-linear-to-t from-brand-navy/70 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-5">
                  <span className="rounded-full bg-black/40 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur-md">
                    Service
                  </span>
                </div>
              </div>

              {/* Service Info */}
              <div className="p-5 sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-white">
                      {service.title}
                    </h3>

                    {service.description && (
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
                        {service.description}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 sm:text-right">
                    <p className="text-xs text-white/30">Price</p>

                    <p className="mt-1 text-xl font-bold text-brand-green">
                      ${Number(service.price).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Delivery */}
                <div className="mt-5 flex items-center gap-2 border-t border-white/6 pt-4 text-xs text-white/40">
                  <Clock3 size={14} className="text-white/25" />

                  <span>
                    Delivery time:{" "}
                    <strong className="font-semibold text-white/70">
                      {service.deliveryDays} days
                    </strong>
                  </span>
                </div>

                {/* Freelancer */}
                {freelancerUser && (
                  <div className="mt-5 flex items-center justify-between rounded-xl border border-white/6 bg-white/2 p-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="group/avatar relative h-10 w-10 shrink-0">
                        {freelancerUser.profile?.avatar?.url ? (
                          <img
                            src={freelancerUser.profile.avatar.url}
                            alt={`${freelancerUser.firstName} ${freelancerUser.lastName}`}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-xs font-semibold text-white/50">
                            {freelancerUser.firstName?.[0]}
                            {freelancerUser.lastName?.[0]}
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

                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wider text-white/25">
                          Freelancer
                        </p>

                        <p className="truncate text-sm font-semibold text-white">
                          {freelancerUser.firstName} {freelancerUser.lastName}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/freelancer/u/${service.freelancer?.user.id}`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/7 text-white/35 transition hover:border-brand-green/20 hover:text-brand-green"
                      aria-label="View freelancer"
                    >
                      <UserRound size={15} />
                    </Link>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

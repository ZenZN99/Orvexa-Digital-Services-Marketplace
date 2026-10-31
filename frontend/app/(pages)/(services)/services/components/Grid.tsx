"use client";

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { IService } from "@/app/types/service";
import { usePresenceStore } from "@/app/stores/usePresenceStore";

interface GridProps {
  visibleServices: IService[];
}

export default function Grid({ visibleServices }: GridProps) {
  const onlineUserIds = usePresenceStore((state) => state.onlineUserIds);

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {visibleServices.map((service) => {
        const user = service.freelancer?.user;
        const isOnline = user ? onlineUserIds.includes(user.id) : false;

        return (
          <article
            key={service.id}
            className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-white/2 transition-all duration-500 hover:-translate-y-1 hover:border-brand-green/20 hover:bg-white/[0.035]"
          >
            {/* Image */}
            <div className="relative aspect-16/10 overflow-hidden">
              <img
                src={service.images[0]?.url}
                alt={service.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
              />

              <div className="absolute inset-0 bg-linear-to-t from-brand-navy/80 via-transparent to-transparent" />

              {/* Category */}
              <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-brand-navy/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/70 backdrop-blur-md">
                {service.category}
              </span>

              {/* Seller */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/10 bg-brand-navy/85 py-1.5 pl-1.5 pr-3 backdrop-blur-xl">
                <div className="group/status relative shrink-0">
                  <img
                    src={user?.profile?.avatar?.url}
                    alt={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
                    className="h-7 w-7 rounded-full object-cover ring-1 ring-white/10"
                  />

                  {isOnline && (
                    <>
                      <span className="absolute -bottom-0.5 -right-0.5 block h-2.5 w-2.5 rounded-full border-2 border-brand-navy bg-brand-green shadow-[0_0_7px_rgba(0,220,130,0.45)]" />

                      <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-brand-navy px-2 py-1 text-[10px] font-medium text-white opacity-0 shadow-xl transition-opacity duration-200 group-hover/status:opacity-100">
                        Online
                      </span>
                    </>
                  )}
                </div>

                <span className="max-w-27.5 truncate text-xs font-medium text-white/80">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              {/* Rating + Price */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Star
                    size={14}
                    fill="currentColor"
                    className="text-brand-green"
                  />

                  <span className="text-sm font-semibold text-white">
                    {service.ratingCount}
                  </span>

                  <span className="text-xs text-white/30">
                    ({service.ratingAverage})
                  </span>
                </div>

                <span className="text-sm font-semibold text-white">
                  From ${service.price}
                </span>
              </div>

              {/* Title */}
              <h3 className="mt-4 line-clamp-1 text-base font-semibold text-white transition-colors duration-300 group-hover:text-brand-green">
                {service.title}
              </h3>

              {/* Description */}
              <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-white/35">
                {service.description}
              </p>

              {/* Button */}
              <Link
                href={`/service/${service.id}`}
                className="group/button mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/3 text-sm font-semibold text-white/70 transition-all duration-300 hover:border-brand-green/20 hover:bg-brand-green hover:text-brand-navy"
              >
                View Service
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover/button:translate-x-1"
                />
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}

"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useServices } from "@/app/hooks/useServices";
import { ArrowRight, Heart, Star } from "lucide-react";

export default function RecommendedServices() {
  const { services } = useServices();

  const recommendedServices = useMemo(() => {
    return services
      .filter(
        (service) => service.status === "published" && service.ratingCount > 0,
      )
      .sort((a, b) => {
        if (b.ratingAverage !== a.ratingAverage) {
          return b.ratingAverage - a.ratingAverage;
        }

        return b.ratingCount - a.ratingCount;
      })
      .slice(0, 6);
  }, [services]);

  return (
    <section className="relative overflow-hidden bg-brand-navy py-24 sm:py-32">
      {/* Background glow */}
      <div className="pointer-events-none absolute right-0 top-20 h-80 w-80 rounded-full bg-brand-green/4 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-green">
              Recommended for you
            </span>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Services worth
              <span className="text-brand-green"> discovering.</span>
            </h2>

            <p className="mt-4 max-w-xl text-base leading-7 text-white/40">
              Explore services from talented freelancers ready to help you turn
              your ideas into reality.
            </p>
          </div>

          <Link
            href="/services"
            className="group hidden shrink-0 items-center gap-2 text-sm font-semibold text-white/60 transition-colors hover:text-brand-green sm:flex"
          >
            Browse services
            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Services */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recommendedServices.map((service) => (
            <article
              key={service.id}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[2 transition-all duration-500 hover:-translate-y-1 hover:border-brand-green/20 hover:bg-white/[0.035]"
            >
              {/* Image */}
              <div className="relative aspect-16/10 overflow-hidden">
                {service.images[0]?.url ? (
                  <img
                    src={service.images[0].url}
                    alt={service.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/5 text-sm text-white/20">
                    No image
                  </div>
                )}

                {/* Image overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-brand-navy/70 via-transparent to-transparent" />

                {/* Seller avatar badge */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/10 bg-brand-navy/85 py-1.5 pl-1.5 pr-3 backdrop-blur-xl">
                  {service.freelancer?.user?.profile?.avatar ? (
                    <img
                      src={service.freelancer.user.profile.avatar.url}
                      alt={`${service.freelancer.user.firstName} ${service.freelancer.user.lastName}`}
                      className="h-7 w-7 rounded-full object-cover ring-1 ring-white/10"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-white/10" />
                  )}

                  <span className="max-w-27.5 truncate text-xs font-medium text-white/80">
                    {service.freelancer?.user?.firstName}{" "}
                    {service.freelancer?.user?.lastName}
                  </span>

                  <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Star
                      size={14}
                      fill="currentColor"
                      className="text-brand-green"
                    />

                    <span className="text-sm font-semibold text-white">
                      {Number(service.ratingAverage).toFixed(1)}
                    </span>

                    <span className="text-xs text-white/30">
                      ({service.ratingCount})
                    </span>
                  </div>

                  <span className="text-sm font-semibold text-white">
                    ${Number(service.price).toFixed(2)}
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
                  className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/3 text-sm font-semibold text-white/70 transition-all duration-300 hover:border-brand-green/20 hover:bg-brand-green hover:text-brand-navy"
                >
                  View Service
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom button */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/services"
            className="group inline-flex h-12 items-center gap-2 rounded-xl border border-white/9 bg-white/3 px-7 text-sm font-semibold text-white transition-all duration-300 hover:border-brand-green/30 hover:bg-brand-green hover:text-brand-navy"
          >
            View All Services
            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

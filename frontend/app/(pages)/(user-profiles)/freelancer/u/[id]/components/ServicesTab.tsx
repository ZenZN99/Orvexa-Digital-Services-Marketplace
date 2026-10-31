"use client";

import { Star } from "lucide-react";
import { Tab } from "../../../page";
import { IUser } from "@/app/types/user";
import { IService, ServiceStatus } from "@/app/types/service";
import ServiceImageSlider from "../../../components/ServiceImagesSlider";
import { useRouter } from "next/navigation";
interface ServicesTabProps {
  activeTab: Tab;
  user: IUser | null;
  freelancerServices: IService[];
}

export default function ServicesTab({
  activeTab,
  user,
  freelancerServices,
}: ServicesTabProps) {
  const router = useRouter();
  return (
    <div>
      {activeTab === "services" && (
        <section className="mt-6">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">
              Marketplace
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Services by {user?.firstName}
            </h2>

            <p className="mt-2 text-sm text-white/40">
              Explore the services offered by this freelancer.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {freelancerServices.map((service) => (
              <article
                key={service.id}
                className="group overflow-hidden rounded-[1.75rem] border border-white/8 bg-white/2.5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-brand-green/20"
              >
                <div className="relative">
                  <ServiceImageSlider
                    images={service.images}
                    title={service.title}
                  />

                  <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-2">
                    {/* Category */}
                    <span className="rounded-lg border border-white/10 bg-black/30 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                      {service.category}
                    </span>

                    {/* Status */}
                    <span
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold backdrop-blur-md ${
                        service.status === ServiceStatus.PUBLISHED
                          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                          : service.status === ServiceStatus.PENDING
                            ? "border-yellow-400/20 bg-yellow-400/10 text-yellow-400"
                            : "border-red-400/20 bg-red-400/10 text-red-400"
                      }`}
                    >
                      {service.status}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="line-clamp-2 min-h-12 text-base font-semibold leading-6">
                    {service.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/40">
                    {service.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Star
                        size={15}
                        className="fill-brand-green text-brand-green"
                      />

                      <span className="text-sm font-semibold">
                        {service.ratingAverage}
                      </span>

                      <span className="text-xs text-white/30">
                        ({service.ratingCount})
                      </span>
                    </div>

                    <div className="text-right">
                      <p className="text-[11px] text-white/30">Starting at</p>

                      <p className="text-lg font-semibold">${service.price}</p>
                    </div>
                  </div>

                  {service.status === ServiceStatus.PUBLISHED && (
                    <button
                      type="button"
                      onClick={() => router.push(`/service/${service.id}`)}
                      className="mt-5 flex h-11 w-full items-center justify-center rounded-xl border border-white/10 bg-white/4 text-sm font-semibold text-white transition hover:border-brand-green/20 hover:bg-brand-green hover:text-white"
                    >
                      View Service
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

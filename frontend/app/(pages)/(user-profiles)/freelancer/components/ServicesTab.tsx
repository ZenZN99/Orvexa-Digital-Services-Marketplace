"use client";

import Link from "next/link";
import { ClipboardCheck, Pencil, Star, Trash2 } from "lucide-react";
import { Tab } from "../page";
import { IService, ServiceStatus } from "@/app/types/service";
import ServiceImageSlider from "./ServiceImagesSlider";
import { useRouter } from "next/navigation";

interface ServicesTabProps {
  activeTab: Tab;
  myServices: IService[];
  onDeleteService: (serviceId: string) => Promise<void>;
}

export default function ServicesTab({
  activeTab,
  myServices,
  onDeleteService,
}: ServicesTabProps) {
  const router = useRouter();
  return (
    <div>
      {activeTab === "services" && (
        <section className="mt-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">
                Marketplace
              </p>

              <h2 className="mt-2 text-2xl font-semibold">Your Services</h2>

              <p className="mt-2 max-w-xl text-sm text-white/40">
                Manage and view the services you offer on Orvexa.
              </p>
            </div>

            <Link
              href="/services/status"
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/70 transition hover:border-brand-green/30 hover:bg-brand-green/10 hover:text-brand-green"
            >
              <ClipboardCheck size={16} />
              Status Services
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {myServices.map((service) => (
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
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => router.push(`/edit-service/${service.id}`)}
                      className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/4 text-sm font-semibold text-white/70 transition hover:border-brand-green/20 hover:bg-brand-green/10 hover:text-brand-green"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteService(service.id)}
                      className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-red-400/10 bg-red-400/5 text-sm font-semibold text-red-400/80 transition hover:border-red-400/20 hover:bg-red-400/10 hover:text-red-400"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
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

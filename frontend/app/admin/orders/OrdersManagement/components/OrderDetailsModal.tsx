"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ImageIcon,
  Package,
  UserRound,
  X,
  ZoomIn,
} from "lucide-react";
import { IOrder } from "@/app/types/order";
import { formatCurrency, formatDate } from "../../utils/formats";
import { statusClasses } from "../../utils/statusClasses";

interface OrderDetailsModalProps {
  order: IOrder;
  onClose: () => void;
}

export default function OrderDetailsModal({
  order,
  onClose,
}: OrderDetailsModalProps) {
  const services = order.services ?? [];

  const [zoomService, setZoomService] = useState<
    (typeof services)[number] | null
  >(null);
  const [zoomIndex, setZoomIndex] = useState(0);

  const openZoom = (service: (typeof services)[number], index: number = 0) => {
    setZoomService(service);
    setZoomIndex(index);
  };

  const closeZoom = () => {
    setZoomService(null);
    setZoomIndex(0);
  };

  const nextZoomImage = () => {
    if (!zoomService?.images?.length) return;
    setZoomIndex((prev) =>
      prev === zoomService.images.length - 1 ? 0 : prev + 1,
    );
  };

  const prevZoomImage = () => {
    if (!zoomService?.images?.length) return;
    setZoomIndex((prev) =>
      prev === 0 ? zoomService.images.length - 1 : prev - 1,
    );
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (zoomService) {
          closeZoom();
        } else {
          onClose();
        }
      }

      if (zoomService) {
        if (e.key === "ArrowRight") nextZoomImage();
        if (e.key === "ArrowLeft") prevZoomImage();
      }
    };

    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [zoomService]);

  return (
    <div
      className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative my-auto w-full max-w-5xl rounded-2xl border border-white/[0.07] bg-brand-navy shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* ===== Header ===== */}
        <div className="flex items-center gap-3.5 border-b border-white/[0.06] px-6 py-5 sm:px-7">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green">
            <Package size={20} />
          </div>

          <div className="min-w-0 flex-1 pr-10">
            <p className="text-xs uppercase tracking-wider text-white/30">
              Order
            </p>
            <h1 className="truncate text-lg font-bold text-white">
              {order.id}
            </h1>
          </div>

          <span
            className={`inline-flex shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium ${statusClasses[order.status]}`}
          >
            {order.status}
          </span>
        </div>

        {/* ===== Two columns ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">
          {/* LEFT: Services */}
          <div className="max-h-[70vh] overflow-y-auto border-b border-white/[0.06] p-6 sm:p-7 lg:border-b-0 lg:border-r">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/35">
              {services.length} {services.length === 1 ? "Service" : "Services"}
            </h2>

            <div className="space-y-3.5">
              {services.map((service, si) => {
                const images = service.images ?? [];
                const freelancerUser = service.freelancer?.user;

                return (
                  <article
                    key={service.id ?? si}
                    className="overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.02]"
                  >
                    <div className="flex gap-4 p-3.5">
                      {/* Thumbnail */}
                      <button
                        type="button"
                        onClick={() => images.length && openZoom(service, 0)}
                        disabled={!images.length}
                        className="group relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-black/20 disabled:cursor-default"
                      >
                        {images.length > 0 ? (
                          <>
                            <img
                              src={images[0].url}
                              alt={service.title}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
                              <ZoomIn size={18} className="text-white" />
                            </div>
                            {images.length > 1 && (
                              <span className="absolute bottom-1 right-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[11px] font-medium text-white/85">
                                +{images.length - 1}
                              </span>
                            )}
                          </>
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-white/15">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </button>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="truncate text-base font-semibold text-white">
                            {service.title}
                          </h3>
                          <span className="shrink-0 text-base font-bold text-brand-green">
                            {formatCurrency(service.price)}
                          </span>
                        </div>

                        {service.description && (
                          <p className="mt-1 line-clamp-1 text-sm leading-6 text-white/35">
                            {service.description}
                          </p>
                        )}

                        <div className="mt-2 flex items-center gap-1.5 text-xs text-white/30">
                          <Clock3 size={13} />
                          {service.deliveryDays}d delivery
                        </div>
                      </div>
                    </div>

                    {/* Freelancer footer */}
                    {freelancerUser && (
                      <div className="flex items-center justify-between border-t border-white/[0.05] bg-white/[0.015] px-3.5 py-2.5">
                        <div className="flex min-w-0 items-center gap-2.5">
                          {freelancerUser.profile?.avatar?.url ? (
                            <img
                              src={freelancerUser.profile.avatar.url}
                              alt={freelancerUser.firstName}
                              className="h-8 w-8 shrink-0 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-[11px] font-semibold text-white/50">
                              {freelancerUser.firstName?.[0]}
                              {freelancerUser.lastName?.[0]}
                            </div>
                          )}

                          <p className="truncate text-xs text-white/50">
                            {freelancerUser.firstName} {freelancerUser.lastName}
                          </p>
                        </div>

                        {service.freelancer?.id && (
                          <Link
                            href={`/freelancer/u/${service.freelancer.id}`}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white/25 transition hover:text-brand-green"
                            aria-label="View freelancer"
                          >
                            <UserRound size={15} />
                          </Link>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Summary + Client */}
          <div className="flex flex-col gap-6 p-6 sm:p-7">
            {/* Dates */}
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2 text-white/35">
                <CalendarDays size={15} />
                <span>Placed {formatDate(order.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-white/30">
                <Clock3 size={15} />
                <span>Updated {formatDate(order.updatedAt)}</span>
              </div>
            </div>

            <div className="h-px bg-white/[0.06]" />

            {/* Client */}
            {order.client && (
              <div>
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-white/30">
                  Client
                </p>

                <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                  <div className="flex min-w-0 items-center gap-3">
                    {order.client.profile?.avatar?.url ? (
                      <img
                        src={order.client.profile.avatar.url}
                        alt={order.client.firstName}
                        className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-white/10"
                      />
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/5 text-sm font-semibold text-white/50">
                        {order.client.firstName?.[0]}
                        {order.client.lastName?.[0]}
                      </div>
                    )}

                    <p className="truncate text-base font-medium text-white">
                      {order.client.firstName} {order.client.lastName}
                    </p>
                  </div>

                  <Link
                    href={`/profile/u/${order.client.id}`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/30 transition hover:text-brand-green"
                    aria-label="View client"
                  >
                    <UserRound size={17} />
                  </Link>
                </div>
              </div>
            )}

            <div className="h-px bg-white/[0.06]" />

            {/* Summary */}
            <div className="mt-auto space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/35">Services</span>
                <span className="text-white/60">{services.length}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-white/35">Subtotal</span>
                <span className="text-white/60">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>

              <div className="h-px bg-white/[0.06]" />

              <div className="flex items-center justify-between pt-0.5">
                <span className="text-base font-semibold text-white">
                  Total
                </span>
                <span className="text-xl font-bold text-brand-green">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Zoom modal ===== */}
      {zoomService && zoomService.images?.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={closeZoom}
        >
          <button
            type="button"
            onClick={closeZoom}
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close"
          >
            <X size={22} />
          </button>

          {zoomService.images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevZoomImage();
              }}
              className="absolute left-5 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          <img
            src={zoomService.images[zoomIndex]?.url}
            alt={`${zoomService.title} ${zoomIndex + 1}`}
            className="max-h-[88vh] max-w-[94vw] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {zoomService.images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextZoomImage();
              }}
              className="absolute right-5 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          )}

          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
            <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-sm text-white/80">
              {zoomIndex + 1} / {zoomService.images.length}
            </span>
            <span className="max-w-xs truncate text-sm text-white/40">
              {zoomService.title}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

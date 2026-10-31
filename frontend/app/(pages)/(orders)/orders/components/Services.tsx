"use client";

import { useState } from "react";
import { IOrder } from "@/app/types/order";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface IServicesProps {
  order: IOrder;
}

export default function Services({ order }: IServicesProps) {
  const [selectedService, setSelectedService] = useState<
    IOrder["services"][number] | null
  >(null);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openImages = (
    service: IOrder["services"][number],
    index: number = 0,
  ) => {
    setSelectedService(service);
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedService(null);
    setSelectedImageIndex(0);
  };

  const nextImage = () => {
    if (!selectedService?.images?.length) return;

    setSelectedImageIndex((prev) =>
      prev === selectedService.images.length - 1 ? 0 : prev + 1,
    );
  };

  const previousImage = () => {
    if (!selectedService?.images?.length) return;

    setSelectedImageIndex((prev) =>
      prev === 0 ? selectedService.images.length - 1 : prev - 1,
    );
  };

  return (
    <>
      <div className="mt-5 space-y-2">
        {order.services.map((service) => {
          const firstImage = service.images?.[0]?.url;

          return (
            <div
              key={service.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/2 px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                {/* Service Image */}
                <button
                  type="button"
                  onClick={() => openImages(service)}
                  disabled={!service.images?.length}
                  className="group relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-white/5 disabled:cursor-default"
                >
                  {firstImage ? (
                    <>
                      <img
                        src={firstImage}
                        alt={service.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/30" />
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-white/20">
                      No image
                    </div>
                  )}
                </button>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {service.title}
                  </p>

                  <p className="mt-1 text-xs text-white/35">
                    {service.deliveryDays} days delivery
                  </p>
                </div>
              </div>

              <span className="ml-4 shrink-0 text-sm font-semibold text-white/80">
                ${Number(service.price).toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Images Modal */}
      {selectedService && selectedService.images?.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white/70 backdrop-blur-md transition hover:bg-black/70 hover:text-white"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Image */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-brand-navy shadow-2xl">
              <img
                src={selectedService.images[selectedImageIndex].url}
                alt={`${selectedService.title} ${selectedImageIndex + 1}`}
                className="mx-auto max-h-[75vh] w-full object-contain"
              />

              {/* Previous */}
              {selectedService.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={previousImage}
                    className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-md transition hover:bg-black/70"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={22} />
                  </button>

                  {/* Next */}
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-md transition hover:bg-black/70"
                    aria-label="Next image"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Info */}
            <div className="mt-3 flex items-center justify-between px-1">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {selectedService.title}
                </p>

                <p className="mt-1 text-xs text-white/35">
                  Image {selectedImageIndex + 1} of{" "}
                  {selectedService.images.length}
                </p>
              </div>

              <span className="ml-4 shrink-0 text-sm font-bold text-brand-green">
                ${Number(selectedService.price).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

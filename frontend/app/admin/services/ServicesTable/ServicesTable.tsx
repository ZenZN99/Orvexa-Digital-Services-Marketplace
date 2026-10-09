"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import type { IService } from "@/app/types/service";
import ServiceRow from "./components/ServiceRow";
import Head from "./components/Head";
import Stats from "./components/Stats";
import DetailsModal from "./components/DetailsModal";
import Pagination from "@/app/shared/components/Pagination";

interface ServicesTableProps {
  services: IService[];

  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function ServicesTable({
  services,
  page = 1,
  totalPages = 1,
  onPageChange,
}: ServicesTableProps) {
  const [selectedService, setSelectedService] = useState<IService | null>(null);

  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-white/2.5 px-6 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/4">
          <Package size={22} className="text-white/20" />
        </div>

        <h3 className="mt-4 text-sm font-medium text-white/60">
          No services found
        </h3>

        <p className="mt-1 max-w-sm text-xs leading-5 text-white/30">
          There are no services matching the current search or filters.
        </p>
      </div>
    );
  }

  const totalOrders = services.reduce(
    (total, service) => total + service.ordersCount,
    0,
  );

  const totalImages = services.reduce(
    (total, service) => total + service.images.length,
    0,
  );

  const ratedServices = services.filter((service) => service.ratingCount > 0);

  const averageRating = ratedServices.length
    ? ratedServices.reduce(
        (total, service) =>
          total +
          (Number.isFinite(Number(service.ratingAverage))
            ? Number(service.ratingAverage)
            : 0),
        0,
      ) / ratedServices.length
    : 0;

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/2.5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-350">
            <Head />

            <tbody>
              {services.map((service) => (
                <ServiceRow
                  key={service.id}
                  service={service}
                  onViewDetails={setSelectedService}
                />
              ))}
            </tbody>
          </table>
        </div>

        <Stats
          services={services}
          totalOrders={totalOrders}
          totalImages={totalImages}
          averageRating={averageRating}
        />
      </div>

      {totalPages > 1 && onPageChange && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}

      {selectedService && (
        <DetailsModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </>
  );
}

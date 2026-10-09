"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/app/stores/useAuthStore";
import { useServices } from "@/app/hooks/useServices";
import { useReviews } from "@/app/hooks/useReviews";
import { useCarts } from "@/app/hooks/useCarts";
import Breadcrumb from "./components/Breadcrumb";
import Images from "./components/Images";
import Rating from "./components/Rating";
import Description from "./components/Description";
import Features from "./components/Features";
import Keywords from "./components/Keywords";
import PurchaseCard from "./components/PurchaseCard";
import Reviews from "./components/Reviews";
import { UserRole } from "@/app/types/user";
import ServiceNotFound from "./components/ServiceNotFound";
import Skeleton from "./components/Skeleton";

export default function ServiceDetails() {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuthStore();
  const { service, fetchServiceById } = useServices();
  const { reviews, loading: reviewsLoading } = useReviews(id);
  const { addItem, loading: cartLoading } = useCarts();

  const [selectedImage, setSelectedImage] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const [loadingService, setLoadingService] = useState(true);

  const user = service?.freelancer?.user;

  useEffect(() => {
    if (!id) return;

    setLoadingService(true);

    fetchServiceById(id).finally(() => setLoadingService(false));
  }, [id]);

  useEffect(() => {
    setSelectedImage(service?.images[0]?.url ?? "");
    setAddedToCart(false);
  }, [service]);

  const handleAddToCart = async () => {
    if (!service) return;

    const result = await addItem(service.id);

    if (result) setAddedToCart(true);
  };

  if (loadingService) {
    return <Skeleton />
  }

  if (!service) {
    return <ServiceNotFound />;
  }

  return (
    <main className="pt-20 min-h-screen bg-brand-navy text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <Breadcrumb service={service} />

        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <Images
            selectedImage={selectedImage}
            service={service}
            setSelectedImage={setSelectedImage}
            user={user}
          />

          <section>
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-full bg-brand-green/10 px-3 py-1 text-sm font-medium text-brand-green">
                {service.category}
              </span>

              <span className="text-sm text-white/40">
                {service.ordersCount} orders
              </span>
            </div>

            <h1 className="text-3xl font-bold leading-tight text-white">
              {service.title}
            </h1>

            <Rating service={service} />

            <div className="my-7 h-px bg-white/8" />

            <Description service={service} />

            <Features service={service} />

            <Keywords service={service} />

            {currentUser?.role === UserRole.CLIENT && (
              <PurchaseCard
                service={service}
                handleAddToCart={handleAddToCart}
                addedToCart={addedToCart}
                loading={cartLoading.adding[service.id]}
              />
            )}
          </section>
        </div>

        {/* Reviews */}
        <Reviews
          service={service}
          reviews={reviews}
          loading={reviewsLoading.global}
        />
      </div>
    </main>
  );
}

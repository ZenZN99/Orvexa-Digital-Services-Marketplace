"use client";

import React from "react";
import ServiceCard from "./ServiceCard";
import EmptyState from "./EmptyState";
import { Loader2 } from "lucide-react";
import { IService } from "@/app/types/service";

interface ContentProps {
  isLoading: boolean;
  visible: IService[];
  myServices: IService[];
}

export default function Content({
  isLoading,
  visible,
  myServices,
}: ContentProps) {
  return (
    <div className="mt-8">
      {isLoading ? (
        <div className="flex items-center justify-center py-24 text-white/40">
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : visible.length === 0 ? (
        <EmptyState hasServices={myServices.length > 0} />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { IService } from "@/app/types/service";
import React from "react";

interface DescriptionProps {
  service: IService | null;
}

export default function Description({ service }: DescriptionProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-white">About this service</h2>

      <p className="mt-3 whitespace-pre-line leading-7 text-white/50">
        {service?.description}
      </p>
    </div>
  );
}

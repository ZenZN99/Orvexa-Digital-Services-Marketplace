"use client";

import { IService, ServiceStatus } from "@/app/types/service";
import React from "react";

interface RejectionReasonProps {
  service: IService;
}

export default function RejectionReason({ service }: RejectionReasonProps) {
  return (
    <div>
      {service.status === ServiceStatus.REJECTED && service.reason && (
        <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
          <h2 className="text-sm font-semibold text-red-400">
            Rejection reason
          </h2>
          <p className="mt-2 text-sm leading-6 text-red-200/70">
            {service.reason}
          </p>
        </section>
      )}
    </div>
  );
}

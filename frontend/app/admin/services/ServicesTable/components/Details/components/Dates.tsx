"use client";

import React from "react";
import InfoRow from "./InfoRow";
import { Calendar } from "lucide-react";
import { formatDate } from "../../../utils/formats";
import { IService } from "@/app/types/service";

interface DatesProps {
  service: IService;
}

export default function Dates({ service }: DatesProps) {
  return (
    <section className="rounded-2xl border border-white/[0.07] bg-white/2 p-5">
      <h2 className="text-sm font-semibold text-white">Timeline</h2>

      <dl className="mt-4 space-y-4">
        <InfoRow
          icon={<Calendar size={14} />}
          label="Created"
          value={formatDate(service.createdAt)}
        />
        <InfoRow
          icon={<Calendar size={14} />}
          label="Updated"
          value={formatDate(service.updatedAt)}
        />
      </dl>
    </section>
  );
}

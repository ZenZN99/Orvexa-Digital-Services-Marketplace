"use client";

import { IService } from "@/app/types/service";
import TableCell from "@/app/admin/components/TableCell";
import { Package } from "lucide-react";

export default function Info({ service }: { service: IService }) {
  return (
    <TableCell>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/5">
          {service.images[0]?.url ? (
            <img
              src={service.images[0].url}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <Package size={16} className="text-white/25" />
          )}
        </div>

        <div className="min-w-0 max-w-62.5">
          <p
            title={service.title}
            className="truncate text-sm font-medium text-white"
          >
            {service.title.length > 20
              ? `${service.title.slice(0, 20)}...`
              : service.title}
          </p>
        </div>
      </div>
    </TableCell>
  );
}

"use client";

import TableCell from "@/app/admin/components/TableCell";
import { IService, ServiceStatus } from "@/app/types/service";
import { XCircle } from "lucide-react";
import { statusClasses } from "../utils/statusClasses";

export default function Status({ service }: { service: IService }) {
  return (
    <TableCell>
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusClasses[service.status]}`}
        >
          {service.status}
        </span>

        {service.status === ServiceStatus.REJECTED && service.reason ? (
          <span title={service.reason} className="cursor-help text-white/20">
            <XCircle size={14} />
          </span>
        ) : null}
      </div>
    </TableCell>
  );
}

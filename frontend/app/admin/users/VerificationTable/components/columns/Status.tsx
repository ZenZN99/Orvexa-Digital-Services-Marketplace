"use client";

import { LucideIcon } from "lucide-react";
import TableCell from "@/app/admin/components/TableCell";

interface StatusConfig {
  icon: LucideIcon;
  label: string;
  className: string;
}
interface StatusProps {
  StatusIcon: LucideIcon;
  config: StatusConfig;
}

export default function Status({ StatusIcon, config }: StatusProps) {
  return (
    <TableCell>
      <span
        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium ${config.className}`}
      >
        <StatusIcon size={12} />
        {config.label}
      </span>
    </TableCell>
  );
}

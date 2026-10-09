"use client";

import { Eye } from "lucide-react";
import TableCell from "@/app/admin/components/TableCell";

interface ViewDetailsProps {
  onView: () => void;
}

export default function ViewDetails({ onView }: ViewDetailsProps) {
  return (
    <TableCell>
      <button
        type="button"
        onClick={onView}
        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-white/10 bg-white/4 px-3 py-1.5 text-xs font-medium text-white/60 transition hover:border-brand-green/20 hover:bg-brand-green hover:text-brand-navy"
      >
        <Eye size={13} />
        View Details
      </button>
    </TableCell>
  );
}

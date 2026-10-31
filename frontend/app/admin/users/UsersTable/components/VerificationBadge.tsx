"use client";

import {
  UserVerificationsStatus,
  UserVerificationStatus,
} from "@/app/types/user-verification";
import { ShieldCheck } from "lucide-react";

export default function VerificationBadge({
  status,
}: {
  status?: UserVerificationStatus;
}) {
  if (status === UserVerificationsStatus.APPROVED) {
    return (
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-blue-500" />
        <span className="text-xs font-semibold text-blue-600">Approved</span>
      </div>
    );
  }

  if (status === UserVerificationsStatus.PENDING) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-orange-500" />
        <span className="text-xs font-semibold text-orange-600">Pending</span>
      </div>
    );
  }

  if (status === UserVerificationsStatus.REJECTED) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-red-500" />
        <span className="text-xs font-semibold text-red-600">Rejected</span>
      </div>
    );
  }

  return <span className="text-xs text-white/40">Not submitted</span>;
}

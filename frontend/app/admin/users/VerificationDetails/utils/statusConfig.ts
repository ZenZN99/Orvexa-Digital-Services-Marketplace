import {
  UserVerificationsStatus,
  UserVerificationStatus,
} from "@/app/types/user-verification";
import { AlertCircle, CheckCircle2, Clock3, LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export const statusConfig: Record<
  UserVerificationStatus,
  {
    label: string;
    className: string;
    icon: LucideIcon;
  }
> = {
  [UserVerificationsStatus.PENDING]: {
    label: "Pending Review",
    className: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    icon: Clock3,
  },

  [UserVerificationsStatus.APPROVED]: {
    label: "Approved",
    className: "border-brand-green/20 bg-brand-green/10 text-brand-green",
    icon: CheckCircle2,
  },

  [UserVerificationsStatus.REJECTED]: {
    label: "Rejected",
    className: "border-red-400/20 bg-red-400/10 text-red-300",
    icon: AlertCircle,
  },
};

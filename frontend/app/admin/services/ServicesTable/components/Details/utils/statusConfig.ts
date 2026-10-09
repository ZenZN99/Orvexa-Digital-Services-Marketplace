import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { ServiceStatus } from "@/app/types/service";

export const statusConfig: Record<
  ServiceStatus,
  {
    label: string;
    className: string;
    icon: typeof CheckCircle2;
  }
> = {
  [ServiceStatus.PENDING]: {
    label: "Pending Review",
    className: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    icon: Clock3,
  },

  [ServiceStatus.PUBLISHED]: {
    label: "Published",
    className: "border-brand-green/20 bg-brand-green/10 text-brand-green",
    icon: CheckCircle2,
  },

  [ServiceStatus.REJECTED]: {
    label: "Rejected",
    className: "border-red-400/20 bg-red-400/10 text-red-300",
    icon: XCircle,
  },
};

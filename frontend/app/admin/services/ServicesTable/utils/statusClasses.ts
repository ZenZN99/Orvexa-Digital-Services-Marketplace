import { ServiceStatus } from "@/app/types/service";

export const statusClasses: Record<ServiceStatus, string> = {
  [ServiceStatus.PENDING]:
    "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",

  [ServiceStatus.PUBLISHED]:
    "border-brand-green/20 bg-brand-green/10 text-brand-green",

  [ServiceStatus.REJECTED]: "border-red-400/20 bg-red-400/10 text-red-300",
};

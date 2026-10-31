import { ContractStatus } from "@/app/types/contract";
import { CheckCircle2, Clock3, FileText, PackageCheck, RotateCcw, XCircle } from "lucide-react";

export const statusConfig = {
  [ContractStatus.IN_PROGRESS]: {
    label: "In Progress",
    className: "border-blue-400/15 bg-blue-400/8 text-blue-300",
    icon: Clock3,
  },

  [ContractStatus.DELIVERED]: {
    label: "Delivered",
    className: "border-yellow-400/15 bg-yellow-400/8 text-yellow-300",
    icon: PackageCheck,
  },

  [ContractStatus.COMPLETED]: {
    label: "Completed",
    className: "border-brand-green/15 bg-brand-green/8 text-brand-green",
    icon: CheckCircle2,
  },

  [ContractStatus.CANCELLED]: {
    label: "Cancelled",
    className: "border-red-400/15 bg-red-400/8 text-red-300",
    icon: XCircle,
  },

  [ContractStatus.DISPUTED]: {
    label: "Disputed",
    className: "border-orange-400/15 bg-orange-400/8 text-orange-300",
    icon: FileText,
  },

  [ContractStatus.REFUNDED]: {
    label: "Refunded",
    className: "border-purple-400/15 bg-purple-400/8 text-purple-300",
    icon: RotateCcw,
  },

  [ContractStatus.EXPIRED]: {
    label: "Expired",
    className: "border-white/10 bg-white/5 text-white/40",
    icon: XCircle,
  },
};

export const formatDate = (date: Date | string | null) => {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};
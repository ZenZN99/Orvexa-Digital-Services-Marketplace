import { PaymentStatus } from "@/app/types/payment";
import { CheckCircle2, Clock3, RotateCcw, XCircle } from "lucide-react";

export const formatDate = (date: Date | null | undefined) => {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

export const ITEMS_PER_PAGE = 5;

export const statusConfig = {
  [PaymentStatus.COMPLETED]: {
    label: "Completed",
    className: "border-brand-green/15 bg-brand-green/8 text-brand-green",
    icon: CheckCircle2,
    description: "This payment has been successfully completed.",
  },

  [PaymentStatus.PENDING]: {
    label: "Pending",
    className: "border-yellow-400/15 bg-yellow-400/8 text-yellow-300",
    icon: Clock3,
    description: "This payment is currently being processed.",
  },

  [PaymentStatus.FAILED]: {
    label: "Failed",
    className: "border-red-400/15 bg-red-400/8 text-red-300",
    icon: XCircle,
    description: "This payment could not be completed.",
  },

  [PaymentStatus.REFUNDED]: {
    label: "Refunded",
    className: "border-blue-400/15 bg-blue-400/8 text-blue-300",
    icon: RotateCcw,
    description: "This payment has been refunded.",
  },
};

import { PaymentStatus } from "@/app/types/payment";

export const statusClasses: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]:
    "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",

  [PaymentStatus.COMPLETED]:
    "border-brand-green/20 bg-brand-green/10 text-brand-green",

  [PaymentStatus.FAILED]: "border-red-400/20 bg-red-400/10 text-red-300",

  [PaymentStatus.REFUNDED]:
    "border-purple-400/20 bg-purple-400/10 text-purple-300",
};

export const formatDate = (date?: Date | null) => {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

export const formatDateTime = (date?: Date | null) => {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
};

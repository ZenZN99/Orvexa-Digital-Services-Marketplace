import { ContractStatus } from "@/app/types/contract";

export const statusClasses: Record<ContractStatus, string> = {
  [ContractStatus.IN_PROGRESS]:
    "border-blue-400/20 bg-blue-400/10 text-blue-300",
  [ContractStatus.DELIVERED]:
    "border-purple-400/20 bg-purple-400/10 text-purple-300",
  [ContractStatus.COMPLETED]:
    "border-brand-green/20 bg-brand-green/10 text-brand-green",
  [ContractStatus.CANCELLED]: "border-red-400/20 bg-red-400/10 text-red-300",
  [ContractStatus.DISPUTED]:
    "border-orange-400/20 bg-orange-400/10 text-orange-300",
  [ContractStatus.REFUNDED]:
    "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
  [ContractStatus.EXPIRED]: "border-white/10 bg-white/[0.04] text-white/45",
};

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

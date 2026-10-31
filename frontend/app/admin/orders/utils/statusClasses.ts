import { OrderStatus } from "@/app/types/order";

export const statusClasses: Record<OrderStatus, string> = {
  [OrderStatus.PENDING_PAYMENT]:
    "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",

  [OrderStatus.IN_PROGRESS]: "border-blue-400/20 bg-blue-400/10 text-blue-300",

  [OrderStatus.COMPLETED]:
    "border-brand-green/20 bg-brand-green/10 text-brand-green",

  [OrderStatus.CANCELLED]: "border-red-400/20 bg-red-400/10 text-red-300",

  [OrderStatus.REFUNDED]:
    "border-purple-400/20 bg-purple-400/10 text-purple-300",

  [OrderStatus.DISPUTED]:
    "border-orange-400/20 bg-orange-400/10 text-orange-300",
};

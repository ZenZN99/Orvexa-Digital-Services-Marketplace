import { OrderStatus } from "@/app/types/order";

export const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    className: string;
  }
> = {
  [OrderStatus.PENDING_PAYMENT]: {
    label: "Pending Payment",
    className: "bg-yellow-400/10 text-yellow-400",
  },

  [OrderStatus.IN_PROGRESS]: {
    label: "In Progress",
    className: "bg-blue-400/10 text-blue-400",
  },

  [OrderStatus.COMPLETED]: {
    label: "Completed",
    className: "bg-brand-green/10 text-brand-green",
  },

  [OrderStatus.CANCELLED]: {
    label: "Cancelled",
    className: "bg-red-400/10 text-red-400",
  },

  [OrderStatus.REFUNDED]: {
    label: "Refunded",
    className: "bg-purple-400/10 text-purple-400",
  },

  [OrderStatus.DISPUTED]: {
    label: "Disputed",
    className: "bg-orange-400/10 text-orange-400",
  },
};

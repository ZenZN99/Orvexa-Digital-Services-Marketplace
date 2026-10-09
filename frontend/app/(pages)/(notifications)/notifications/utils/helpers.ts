import { NotificationType } from "@/app/types/notification";
import {
  Bell,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileText,
  MessageSquare,
  PackageCheck,
  Star,
  UserCheck,
  UserRoundX,
  WalletCards,
  XCircle,
} from "lucide-react";
import { ElementType } from "react";

export type NotificationVisualConfig = {
  icon: ElementType;
  iconClass: string;
  bgClass: string;
};

export const defaultConfig: NotificationVisualConfig = {
  icon: Bell,
  iconClass: "text-white/40",
  bgClass: "bg-white/5",
};

export const notificationConfig: Record<
  NotificationType,
  NotificationVisualConfig
> = {
  [NotificationType.BLOCK_USER]: {
    icon: UserRoundX,
    iconClass: "text-red-400",
    bgClass: "bg-red-400/10",
  },

  [NotificationType.USER_VERIFICATION]: {
    icon: UserCheck,
    iconClass: "text-blue-400",
    bgClass: "bg-blue-400/10",
  },

  [NotificationType.USER_VERIFICATION_APPROVED]: {
    icon: CheckCircle2,
    iconClass: "text-brand-green",
    bgClass: "bg-brand-green/10",
  },

  [NotificationType.USER_VERIFICATION_REJECTED]: {
    icon: XCircle,
    iconClass: "text-red-400",
    bgClass: "bg-red-400/10",
  },

  [NotificationType.SERVICE_REVIEW]: {
    icon: FileCheck2,
    iconClass: "text-amber-300",
    bgClass: "bg-amber-300/10",
  },

  [NotificationType.SERVICE_APPROVED]: {
    icon: CheckCircle2,
    iconClass: "text-brand-green",
    bgClass: "bg-brand-green/10",
  },

  [NotificationType.SERVICE_REJECTED]: {
    icon: XCircle,
    iconClass: "text-red-400",
    bgClass: "bg-red-400/10",
  },

  [NotificationType.CONTRACT_MESSAGE]: {
    icon: MessageSquare,
    iconClass: "text-blue-400",
    bgClass: "bg-blue-400/10",
  },

  [NotificationType.CONTRACT_EXPIRED]: {
    icon: Clock3,
    iconClass: "text-orange-400",
    bgClass: "bg-orange-400/10",
  },

  [NotificationType.CONTRACT_COMPLETED]: {
    icon: CheckCircle2,
    iconClass: "text-brand-green",
    bgClass: "bg-brand-green/10",
  },

  [NotificationType.CONTRACT_DELIVERED]: {
    icon: PackageCheck,
    iconClass: "text-purple-400",
    bgClass: "bg-purple-400/10",
  },

  [NotificationType.REVIEW_CREATED]: {
    icon: Star,
    iconClass: "text-yellow-300",
    bgClass: "bg-yellow-300/10",
  },

  [NotificationType.CONTRACT]: {
    icon: FileText,
    iconClass: "text-blue-400",
    bgClass: "bg-blue-400/10",
  },

  [NotificationType.PAYMENT]: {
    icon: WalletCards,
    iconClass: "text-brand-green",
    bgClass: "bg-brand-green/10",
  },
};

export function formatTime(date?: Date | string) {
  if (!date) return "";

  const createdAt = new Date(date);

  if (Number.isNaN(createdAt.getTime())) return "";

  const now = new Date();

  // Clamp to 0 to avoid negative values when client/server clocks differ
  const diff = Math.max(0, now.getTime() - createdAt.getTime());

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return createdAt.toLocaleDateString();
}

export function formatType(type: NotificationType) {
  return String(type)
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

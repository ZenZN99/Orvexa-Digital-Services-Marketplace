import { SupportConversationStatus } from "@/app/types/support-conversation";

export const supportStatusClasses: Record<SupportConversationStatus, string> = {
  [SupportConversationStatus.OPEN]:
    "border-brand-green/20 bg-brand-green/10 text-brand-green",
  [SupportConversationStatus.CLOSED]:
    "border-white/10 bg-white/5 text-white/40",
};


export const formatDate = (date?: Date | string | null) => {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

export const formatDateTime = (date?: Date | string | null) => {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
};


import {
  ISupportConversation,
  SupportConversationStatus,
} from "@/app/types/support-conversation";

export const statusClasses: Record<ISupportConversation["status"], string> = {
  [SupportConversationStatus.OPEN]:
    "border-brand-green/20 bg-brand-green/10 text-brand-green",

  [SupportConversationStatus.CLOSED]:
    "border-white/10 bg-white/[0.05] text-white/45",
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

export const userLabel = (
  user?: { firstName: string; lastName: string } | null,
  fallbackId?: string | null,
) => (user ? `${user.firstName} ${user.lastName}` : fallbackId || "—");

import { ServiceStatus } from "@/app/types/service";
import { CheckCircle2, Hourglass, XCircle } from "lucide-react";

export const statusConfig = {
  [ServiceStatus.PENDING]: {
    label: "Under review",
    icon: Hourglass,
    card: "border-yellow-500/25",
    banner: "border-yellow-500/25 bg-yellow-500/10",
    iconWrap: "bg-yellow-500/15 text-yellow-400",
    title: "text-yellow-400",
    text: "text-yellow-100/60",
    chip: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  },
  [ServiceStatus.REJECTED]: {
    label: "Rejected",
    icon: XCircle,
    card: "border-red-500/25",
    banner: "border-red-500/25 bg-red-500/10",
    iconWrap: "bg-red-500/15 text-red-400",
    title: "text-red-400",
    text: "text-red-100/60",
    chip: "border-red-500/30 bg-red-500/10 text-red-400",
  },
  [ServiceStatus.PUBLISHED]: {
    label: "Published",
    icon: CheckCircle2,
    card: "border-emerald-500/25",
    banner: "border-emerald-500/25 bg-emerald-500/10",
    iconWrap: "bg-emerald-500/15 text-emerald-400",
    title: "text-emerald-400",
    text: "text-emerald-100/60",
    chip: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  },
} as const;

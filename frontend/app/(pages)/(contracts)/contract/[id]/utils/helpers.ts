import { ContractStatus } from "@/app/types/contract";
import { IUser } from "@/app/types/user";

export const formatTime = (date?: Date | string) =>
  date
    ? new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(date))
    : "";

export const formatDate = (date?: Date | string | null) =>
  date
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(date))
    : "—";

export const formatDayLabel = (date?: Date | string) =>
  date
    ? new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date(date))
    : "";

export const statusLabel = (status?: ContractStatus) =>
  status
    ? status
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/^\w/, (c) => c.toUpperCase())
    : "";

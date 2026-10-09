import { SupportConversationStatus } from "@/app/types/support-conversation";
import { StatusFilter } from "../SupportManagement";

export const statusOptions: {
  label: string;
  value: StatusFilter;
}[] = [
  { label: "All conversations", value: "all" },
  { label: "Open", value: SupportConversationStatus.OPEN },
  { label: "Closed", value: SupportConversationStatus.CLOSED },
];

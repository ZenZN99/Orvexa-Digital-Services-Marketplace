import { ISupportConversation } from "./support-conversation";
import { UserRole } from "./user";

export interface ISupportMessage {
  id: string;
  conversationId: string;
  senderId: string;
  message: string | null;
  attachments: string[];
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    profile?: {
      avatar?: { url: string; publicId: string } | null;
    };
  };
}

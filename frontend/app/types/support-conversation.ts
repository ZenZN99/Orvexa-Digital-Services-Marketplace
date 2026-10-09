export enum SupportConversationStatus {
  OPEN = "open",
  CLOSED = "closed",
}

export interface ISupportConversation {
  id: string;
  userId: string;
  status: SupportConversationStatus;
  lastMessage: string;
  lastMessageSenderId: string;
  closedAt: Date | null;
  closedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profile?: {
      avatar?: { url: string; publicId: string } | null;
    };
  };
  lastMessageSender?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  closedByUser?: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
}

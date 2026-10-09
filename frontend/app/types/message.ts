import { IContract } from "./contract";
import { IUser } from "./user";

export interface IMessage {
  id: string;
  contractId: string;
  senderId: string;
  content: string | null;
  images: {
    url: string;
    publicId: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
  contract: IContract;
  sender: IUser;
}

export interface MessageStore {
  messages: IMessage[];
  isConnected: boolean;

  connect: () => void;
  disconnect: () => void;

  addMessage: (message: IMessage) => void;
  deleteMessage: (messageId: string) => void;

  setMessages: (messages: IMessage[]) => void;
  clearMessages: () => void;
}

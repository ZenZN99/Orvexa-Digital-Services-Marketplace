import { IUser } from "./user";

export enum NotificationType {
  BLOCK_USER = "block user",
  USER_VERIFICATION = "user verification",
  USER_VERIFICATION_APPROVED = "user verification approved",
  USER_VERIFICATION_REJECTED = "user verification rejected",
  SERVICE_REVIEW = "service review",
  SERVICE_APPROVED = "service approved",
  SERVICE_REJECTED = "service rejected",
  CONTRACT_MESSAGE = "contract message",
  CONTRACT_EXPIRED = "contract expired",
  CONTRACT_COMPLETED = "contract completed",
  CONTRACT_DELIVERED = "contract delivered",
  REVIEW_CREATED = "review created",
  CONTRACT = "contract",
  PAYMENT = "payment",
}

export interface INotification {
  id: string;
  senderId: string;
  receiverId: string;
  targetId: string | null;
  type: NotificationType;
  message: string;
  isRead: boolean;
  link: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  sender: IUser;
  receiver: IUser;
}

export interface NotificationStore {
  notifications: INotification[];
  unreadCount: number;
  isConnected: boolean;

  connect: () => void;
  disconnect: () => void;

  addNotification: (notification: INotification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;

  setNotifications: (notifications: INotification[]) => void;
  clearNotifications: () => void;
}
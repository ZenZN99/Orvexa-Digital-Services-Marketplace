import { IContract } from "./contract";
import { IUser } from "./user";

export enum OrderStatus {
  PENDING_PAYMENT = "pending_payment",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
  DISPUTED = "disputed",
}

export interface IOrder {
  id: string;
  clientId: string;
  totalAmount: number;
  status: OrderStatus;

  services: {
    id: string;
    title: string;
    description: string;
    price: number;
    deliveryDays: number;

    images: {
      url: string;
      publicId: string;
    }[];

    freelancer: {
      id: string;
      user: {
        id: string;
        firstName: string;
        lastName: string;
        profile: { avatar: { url: string; publicId: string } | null };
      };
    };
  }[];

  client: IUser;
  createdAt?: Date;
  updatedAt?: Date;
}

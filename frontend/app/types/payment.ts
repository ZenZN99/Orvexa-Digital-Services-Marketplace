import { IOrder } from "./order";
import { IUser } from "./user";

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export interface IPayment {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  status: PaymentStatus;
  paidAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  user: IUser;
  order: IOrder;
}

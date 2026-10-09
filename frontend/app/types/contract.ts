import { IFreelancer } from "./freelancer";
import { IOrder } from "./order";
import { IService } from "./service";
import { IUser } from "./user";

export enum ContractStatus {
  IN_PROGRESS = "in_progress",
  DELIVERED = "delivered",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  DISPUTED = "disputed",
  REFUNDED = "refunded",
  EXPIRED = "expired",
}

export interface IContract {
  id: string;
  orderId: string;
  serviceId: string;
  freelancerId: string;
  clientId: string;
  amount: number;
  deliveryDays: number;
  deadline: Date;
  status: ContractStatus;
  deliveredAt: Date | null;
  completedAt: Date | null;
  cancelledAt: Date | null;
  cancellationReason: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  order: IOrder;
  service: IService;
  freelancer: IFreelancer;
  client: IUser;
}

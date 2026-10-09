import { IService } from "./service";

export interface ICartItem {
  id: string;
  cartId: string;
  serviceId: string;
  service: IService;
  createdAt?: Date;
  updatedAt?: Date;
}

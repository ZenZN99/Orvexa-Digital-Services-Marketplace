import { ICartItem } from "./cart-item";

export interface ICart {
  id: string;
  userId: string;
  items: ICartItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

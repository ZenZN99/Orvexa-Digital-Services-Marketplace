import { Model } from 'sequelize-typescript';
import { CartItem } from './cart-item.schema.js';
export declare class Cart extends Model {
    id: string;
    userId: string;
    items: CartItem[];
}

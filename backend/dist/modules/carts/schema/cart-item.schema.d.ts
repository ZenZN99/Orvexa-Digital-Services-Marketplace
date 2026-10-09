import { Model } from 'sequelize-typescript';
import { Service } from '../../services/schema/service.schema.js';
export declare class CartItem extends Model {
    id: string;
    cartId: string;
    serviceId: string;
    service: Service;
}

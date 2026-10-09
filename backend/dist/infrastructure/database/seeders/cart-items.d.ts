import { Cart } from '../../../modules/carts/schema/cart.schema.js';
import { Service } from '../../../modules/services/schema/service.schema.js';
export declare const generateCartItems: (createdCarts: Cart[], createdServices: Service[]) => {
    cartId: string;
    serviceId: string;
}[];

import { ServiceCategory } from '../../../common/enums/service.enum.js';
export declare class CreateServiceDTO {
    category: ServiceCategory;
    title: string;
    description: string;
    features: string[];
    keywords: string[];
    price: number;
    deliveryDays: number;
}

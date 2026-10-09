import { Model } from 'sequelize-typescript';
import { Freelancer } from '../../profiles/freelancer/schema/freelancer.schema.js';
import { ServiceCategory, ServiceStatus } from '../../../common/enums/service.enum.js';
export declare class Service extends Model {
    id: string;
    freelancerId: string;
    freelancer: Freelancer;
    category: ServiceCategory;
    title: string;
    description: string;
    features: string[];
    images: {
        url: string;
        publicId: string;
    }[];
    keywords: string[];
    price: number;
    deliveryDays: number;
    status: ServiceStatus;
    ordersCount: number;
    ratingCount: number;
    ratingAverage: number;
    reason: string | null;
}

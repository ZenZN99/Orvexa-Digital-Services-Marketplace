import { Model } from 'sequelize-typescript';
import { Contract } from '../../contracts/schema/contract.schema.js';
import { Service } from '../../services/schema/service.schema.js';
import { User } from '../../users/schema/user.schema.js';
import { Freelancer } from '../../profiles/freelancer/schema/freelancer.schema.js';
export declare class Review extends Model {
    id: string;
    contractId: string;
    contract: Contract;
    serviceId: string;
    service: Service;
    clientId: string;
    client: User;
    freelancerId: string;
    freelancer: Freelancer;
    rating: number;
    comment: string | null;
}

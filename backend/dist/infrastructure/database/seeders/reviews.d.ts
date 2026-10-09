import { Contract } from '../../../modules/contracts/schema/contract.schema.js';
export declare const generateReviews: (createdContracts: Contract[]) => {
    contractId: string;
    serviceId: string;
    clientId: string;
    freelancerId: string;
    rating: number;
    comment: string;
}[];

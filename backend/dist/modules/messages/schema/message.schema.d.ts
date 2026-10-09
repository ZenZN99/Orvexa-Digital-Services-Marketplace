import { Model } from 'sequelize-typescript';
import { Contract } from '../../contracts/schema/contract.schema.js';
import { User } from '../../users/schema/user.schema.js';
export declare class Message extends Model {
    id: string;
    contractId: string;
    contract: Contract;
    senderId: string;
    sender: User;
    content: string | null;
    images: {
        url: string;
        publicId: string;
    }[];
}

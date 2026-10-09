import { Model } from 'sequelize-typescript';
import { User } from '../../../users/schema/user.schema.js';
import { JobTitle, Skills } from '../../../../common/enums/freelancer.enum.js';
export declare class Freelancer extends Model {
    id: string;
    userId: string;
    jobTitle: JobTitle;
    about: string;
    skills: Skills[];
    website: string | null;
    completedOrders: number;
    ratingCount: number;
    ratingAverage: number;
    user: User;
}

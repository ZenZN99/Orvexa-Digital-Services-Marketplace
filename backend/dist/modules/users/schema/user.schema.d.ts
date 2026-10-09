import { Model } from 'sequelize-typescript';
import { UserRole } from '../../../common/enums/user.enum.js';
import { UserProfile } from '../../profiles/user-profiles/schema/user-profile.schema.js';
export declare class User extends Model {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
    refreshToken: string | null;
    isActive: boolean;
    balance: number;
    frozenBalance: number;
    lastLoginAt: Date | null;
    profile: UserProfile;
}

import { Model } from 'sequelize-typescript';
export declare class UserProfile extends Model {
    id: string;
    userId: string;
    avatar: {
        url: string;
        publicId: string;
    } | null;
    cover: {
        url: string;
        publicId: string;
    } | null;
    bio: string;
}

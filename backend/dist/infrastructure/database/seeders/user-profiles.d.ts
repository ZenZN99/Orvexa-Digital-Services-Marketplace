import { User } from "../../../modules/users/schema/user.schema.js";
export declare const generateUserProfiles: (createdUsers: User[]) => {
    userId: string;
    avatar: {
        url: string;
        publicId: string;
    };
    cover: {
        url: string;
        publicId: string;
    };
    bio: string;
}[];

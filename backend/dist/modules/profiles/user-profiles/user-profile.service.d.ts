import { UserProfile } from './schema/user-profile.schema.js';
import { UpdateUserProfileDTO } from './dto/update.js';
import { CloudinaryService } from '../../../infrastructure/cloudinary/cloudinary.service.js';
export declare class UserProfileService {
    private readonly userProfileModel;
    private readonly cloudinaryService;
    constructor(userProfileModel: typeof UserProfile, cloudinaryService: CloudinaryService);
    update(userId: string, data: UpdateUserProfileDTO, avatar?: Express.Multer.File, cover?: Express.Multer.File): Promise<{
        message: string | null;
        data: any;
    }>;
}

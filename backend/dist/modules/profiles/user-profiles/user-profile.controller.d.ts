import { UserProfileService } from './user-profile.service.js';
import { UpdateUserProfileDTO } from './dto/update.js';
import type { RequestWithUser } from '../../../types/express.js';
export declare class UserProfileController {
    private readonly userProfileService;
    constructor(userProfileService: UserProfileService);
    update(req: RequestWithUser, data: UpdateUserProfileDTO, files: {
        avatar?: Express.Multer.File[];
        cover?: Express.Multer.File[];
    }): Promise<{
        message: string | null;
        data: any;
    }>;
}

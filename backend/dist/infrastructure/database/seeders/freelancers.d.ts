import { JobTitle, Skills } from '../../../common/enums/freelancer.enum.js';
import { User } from '../../../modules/users/schema/user.schema.js';
export declare const generateFreelancers: (createdUsers: User[]) => {
    userId: string;
    jobTitle: JobTitle.SOFTWARE_ENGINEER | JobTitle.SOFTWARE_DEVELOPER | JobTitle.FULL_STACK_DEVELOPER | JobTitle.BACKEND_DEVELOPER | JobTitle.FRONTEND_DEVELOPER | JobTitle.MOBILE_APP_DEVELOPER | JobTitle.DEVOPS_ENGINEER | JobTitle.DATA_ANALYST | JobTitle.DATA_SCIENTIST | JobTitle.UI_UX_DESIGNER | JobTitle.GRAPHIC_DESIGNER | JobTitle.MOTION_GRAPHICS_DESIGNER | JobTitle.ILLUSTRATOR | JobTitle.THREE_D_ARTIST | JobTitle.VIDEO_EDITOR | JobTitle.ANIMATOR | JobTitle.PHOTOGRAPHER | JobTitle.CONTENT_WRITER | JobTitle.COPYWRITER | JobTitle.TRANSLATOR | JobTitle.VOICE_OVER_ARTIST | JobTitle.DIGITAL_MARKETER | JobTitle.SEO_SPECIALIST | JobTitle.SOCIAL_MEDIA_MANAGER | JobTitle.VIRTUAL_ASSISTANT | JobTitle.CUSTOMER_SUPPORT_SPECIALIST | JobTitle.BUSINESS_CONSULTANT | JobTitle.PROJECT_MANAGER | JobTitle.ACCOUNTANT;
    about: string;
    skills: Skills[];
    website: string | null;
    completedOrders: number;
    ratingCount: number;
    ratingAverage: number;
}[];

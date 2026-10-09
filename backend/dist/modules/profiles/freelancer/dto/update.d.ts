import { JobTitle, Skills } from '../../../../common/enums/freelancer.enum.js';
export declare class UpdateFreelancerDTO {
    jobTitle?: JobTitle;
    about?: string;
    skills?: Skills[];
    website?: string;
}

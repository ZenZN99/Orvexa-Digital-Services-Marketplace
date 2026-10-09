import { Freelancer } from '../../../modules/profiles/freelancer/schema/freelancer.schema.js';
import { Service } from '../../../modules/services/schema/service.schema.js';
export declare const generateServices: (createdFreelancers: Freelancer[]) => Partial<Service>[];

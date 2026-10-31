import type { ValidationSchema } from 'riser-bob';
import { JobTitle } from '../schemas/enums/freelancers.enum';

export const UpdateFreelancerRule = {
  jobTitle: ['nullable', `enum:${Object.values(JobTitle).join(',')}`],
  about: ['nullable', 'string', 'minLength:3', 'maxLength:500'],
  skills: ['nullable', 'array', 'maxItems:10'],
  website: ['nullable', 'url'],
} satisfies ValidationSchema;

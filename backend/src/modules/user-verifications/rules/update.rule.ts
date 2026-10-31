import type { ValidationSchema } from 'riser-bob';
import { UserVerificationStatus } from '../schemas/enums/user-verification.enum';

export const UpdateUserVerificationRule = {
  status: [
    'required',
    `enum:${Object.values(UserVerificationStatus).join(',')}`,
  ],
  rejectionReason: ['nullable', 'string', 'maxLength:500'],
} satisfies ValidationSchema;

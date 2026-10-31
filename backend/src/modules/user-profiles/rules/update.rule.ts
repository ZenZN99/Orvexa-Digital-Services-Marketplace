import type { ValidationSchema } from 'riser-bob';

export const UpdateUserProfileRule = {
  bio: ['nullable', 'string', 'minLength:3', 'maxLength:254'],
} satisfies ValidationSchema;

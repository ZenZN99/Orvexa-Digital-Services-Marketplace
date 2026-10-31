import type { ValidationSchema } from 'riser-bob';

export const RgisterRule = {
  firstName: ['required', 'string', 'minLength:3', 'maxLength:50'],
  lastName: ['required', 'string', 'minLength:3', 'maxLength:50'],
  email: ['required', 'email'],
  password: ['required', 'string', 'minLength:8', 'maxLength:40'],
  role: ['required', 'enum:admin,support,freelancer,client'],
} satisfies ValidationSchema;

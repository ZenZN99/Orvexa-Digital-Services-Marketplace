import type { ValidationSchema } from 'riser-bob';

export const LoginRule = {
  email: ['required', 'email'],
  password: ['required', 'string', 'minLength:8', 'maxLength:40'],
} satisfies ValidationSchema;

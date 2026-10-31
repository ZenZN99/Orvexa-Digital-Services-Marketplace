import type { ValidationSchema } from 'riser-bob';

export const UpdateAmountRule = {
  amount: ['required', 'number', 'min:1'],
} satisfies ValidationSchema;

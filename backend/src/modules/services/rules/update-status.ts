import type { ValidationSchema } from 'riser-bob';
import { ServiceStatus } from '../schemas/enums/service.enum';

export const UpdateServiceStatusRule = {
  status: ['required', `enum:${Object.values(ServiceStatus).join(',')}`],
  reason: ['nullable', 'string'],
} satisfies ValidationSchema;

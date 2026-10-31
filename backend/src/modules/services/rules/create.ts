import type { ValidationSchema } from 'riser-bob';
import { ServiceCategory } from '../schemas/enums/service.enum';

export const CreateServiceRule = {
  category: ['required', `enum:${Object.values(ServiceCategory).join(',')}`],
  title: ['required', 'string', 'minLength:10', 'maxLength:150'],
  description: ['required', 'string', 'minLength:50', 'maxLength:5000'],
  features: ['required', 'array', 'minItems:1', 'maxItems:10'],
  keywords: ['required', 'array', 'minItems:1', 'maxItems:10'],
  price: ['required', 'number', 'min:1'],
  deliveryDays: ['required', 'number', 'min:1', 'max:90'],
} satisfies ValidationSchema;

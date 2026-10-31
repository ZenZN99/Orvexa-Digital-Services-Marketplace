import type { ValidationSchema } from "riser-bob";

export const CreateMessageRule = {
  content: ["nullable", "string", "minLength:1", "maxLength:5000"],
} satisfies ValidationSchema;

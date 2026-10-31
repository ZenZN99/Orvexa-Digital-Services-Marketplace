import type { ValidationSchema } from "riser-bob";

export const CreateReviewRule = {
  rating: ["required", "number", "min:1", "max:5"],
  comment: ["nullable", "string", "minLength:10", "maxLength:200"],
} satisfies ValidationSchema;

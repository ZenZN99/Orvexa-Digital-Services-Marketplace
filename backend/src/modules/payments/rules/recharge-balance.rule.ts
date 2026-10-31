import type { ValidationSchema } from "riser-bob";

export const RechargeBalanceRule = {
  amount: ["required", "number", "min:1"],
} satisfies ValidationSchema;

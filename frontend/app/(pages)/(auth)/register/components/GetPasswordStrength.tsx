"use client";

import {
  PASSWORD_REQUIREMENTS,
  PasswordStrength,
  STRENGTH_LEVELS,
} from "../constants/register.constant";

export default function getPasswordStrength(
  password: string,
): PasswordStrength {
  const score = PASSWORD_REQUIREMENTS.reduce(
    (total, req) => total + (req.test(password) ? 1 : 0),
    0,
  );

  return { score, ...STRENGTH_LEVELS[score] };
}

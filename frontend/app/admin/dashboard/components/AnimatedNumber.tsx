"use client";

import { formatCurrency, useCountUp } from "../utils/helpers";

interface AnimatedNumberProps {
  value: number;
  currency?: boolean;
  suffix?: string;
}

export default function AnimatedNumber({
  value,
  currency = false,
  suffix = "",
}: AnimatedNumberProps) {
  const animated = useCountUp(value);

  if (currency) {
    return <>{formatCurrency(animated, value >= 1000 ? 0 : 2)}</>;
  }

  return (
    <>
      {Math.round(animated).toLocaleString("en-US")}
      {suffix}
    </>
  );
}

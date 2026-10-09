"use client";

import { CSSProperties, ReactNode } from "react";

interface RevealProps {
  delay?: number;
  className?: string;
  children: ReactNode;
}

export default function Reveal({
  delay = 0,
  className = "",
  children,
}: RevealProps) {
  return (
    <div
      className={`dash-rise ${className}`}
      style={{ "--d": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

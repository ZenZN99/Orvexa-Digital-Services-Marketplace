"use client";

import { CSSProperties } from "react";

interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
}

export default function Skeleton({ className = "", style }: SkeletonProps) {
  return (
    <div className={`dash-shimmer rounded-md ${className}`} style={style} />
  );
}

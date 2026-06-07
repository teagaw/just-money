"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn("skeleton", className)}
      style={style}
      aria-hidden="true"
    />
  );
}

/**
 * Tiny progressive loader: yields after a tick so the UI shows skeleton
 * only when the wait is real. Prevents flash-of-skeleton on cached loads.
 */
export function Deferred({
  children,
  fallback,
  delay = 200,
}: {
  children: React.ReactNode;
  fallback: React.ReactNode;
  delay?: number;
}) {
  const [showFallback, setShowFallback] = useState(delay === 0);
  useEffect(() => {
    const t = setTimeout(() => setShowFallback(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return <>{showFallback ? fallback : children}</>;
}

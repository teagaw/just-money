"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const VARIANT_STYLES: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-fg hover:bg-accent/90 active:bg-accent/85 border border-accent/0",
  secondary:
    "bg-surface-2 text-fg hover:bg-muted border border-border",
  ghost:
    "bg-transparent text-fg-muted hover:text-fg hover:bg-surface-2 border border-transparent",
  danger:
    "bg-danger/10 text-danger hover:bg-danger/15 border border-danger/20",
};

const SIZE_STYLES: Record<Size, string> = {
  sm: "h-8 px-2.5 text-xs",
  md: "h-9 px-3.5 text-sm",
  lg: "h-11 px-5 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "secondary", size = "md", className, ...props },
    ref
  ) {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none",
          VARIANT_STYLES[variant],
          SIZE_STYLES[size],
          className
        )}
        {...props}
      />
    );
  }
);

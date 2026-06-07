import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const FIELD =
  "block w-full rounded-md bg-surface-2 border border-border px-3 py-2 text-sm text-fg placeholder:text-fg-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-colors";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn(FIELD, className)} {...props} />;
  }
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cn(FIELD, "min-h-[88px]", className)} {...props} />;
});

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, children, ...props }, ref) {
  return (
    <select ref={ref} className={cn(FIELD, "pr-8", className)} {...props}>
      {children}
    </select>
  );
});

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-xs font-medium text-fg-muted">{label}</span>
      {children}
      {hint && <span className="text-2xs text-fg-muted/80">{hint}</span>}
    </label>
  );
}

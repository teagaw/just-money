import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pt-6 pb-6",
        className
      )}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-2xs uppercase tracking-widest text-fg-muted font-medium">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-1.5 text-2xl sm:text-3xl font-semibold tracking-tight text-balance">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm text-fg-muted text-pretty max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}

import { cn } from "@/lib/utils";

type Trend = "up" | "down" | "flat";

export function KpiCard({
  label,
  value,
  hint,
  trend,
  trendValue,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  trend?: Trend;
  trendValue?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative p-5 rounded-lg bg-surface border border-border overflow-hidden",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-2xs uppercase tracking-widest text-fg-muted font-medium">
          {label}
        </span>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-2xs font-medium num",
              trend === "up" && "text-success",
              trend === "down" && "text-danger",
              trend === "flat" && "text-fg-muted"
            )}
          >
            <span aria-hidden>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
            </span>
            {trendValue}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-3xl font-semibold tracking-tight num">{value}</span>
      </div>
      {hint && (
        <p className="mt-2 text-xs text-fg-muted leading-relaxed">{hint}</p>
      )}
    </div>
  );
}

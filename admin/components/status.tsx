import { cn } from "@/lib/utils";
import type { ProductStatus, ProductLine } from "@/lib/types";
import { STATUS_LABELS, LINE_LABELS } from "@/lib/types";

const STATUS_STYLES: Record<ProductStatus, string> = {
  idea: "bg-muted text-fg-muted",
  researching: "bg-info/10 text-info",
  building: "bg-accent/10 text-accent",
  critiquing: "bg-warn/10 text-warn",
  listed: "bg-success/10 text-success",
  archived: "bg-muted text-fg-muted line-through",
};

const STATUS_DOT: Record<ProductStatus, string> = {
  idea: "bg-fg-muted",
  researching: "bg-info",
  building: "bg-accent",
  critiquing: "bg-warn",
  listed: "bg-success",
  archived: "bg-fg-muted",
};

export function StatusPill({
  status,
  className,
}: {
  status: ProductStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-2xs uppercase tracking-widest font-medium",
        STATUS_STYLES[status],
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[status])} />
      {STATUS_LABELS[status]}
    </span>
  );
}

const LINE_DOT: Record<ProductLine, string> = {
  notion: "bg-fg",
  canva: "bg-accent",
  prompts: "bg-info",
  spreadsheets: "bg-warn",
  resume: "bg-danger",
};

export function LineBadge({
  line,
  className,
}: {
  line: ProductLine;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-2xs uppercase tracking-widest text-fg-muted",
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", LINE_DOT[line])} />
      {LINE_LABELS[line]}
    </span>
  );
}

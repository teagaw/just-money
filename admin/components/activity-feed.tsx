import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/lib/format";
import type { ProductionEvent, Product } from "@/lib/types";

const EVENT_META: Record<string, { label: string; tone: string }> = {
  idea_added: { label: "Idea added", tone: "text-fg-muted" },
  research_started: { label: "Research started", tone: "text-info" },
  build_started: { label: "Build started", tone: "text-accent" },
  critique_started: { label: "Critique started", tone: "text-warn" },
  critique_completed: { label: "Critique completed", tone: "text-warn" },
  listed: { label: "Listed live", tone: "text-success" },
  archived: { label: "Archived", tone: "text-fg-muted" },
};

export function ActivityFeed({
  events,
  products,
  limit,
}: {
  events: ProductionEvent[];
  products: Product[];
  limit?: number;
}) {
  const list = limit ? events.slice(0, limit) : events;
  return (
    <ol className="relative">
      {list.map((event, i) => {
        const meta = EVENT_META[event.event_type] ?? {
          label: event.event_type.replace(/_/g, " "),
          tone: "text-fg-muted",
        };
        const product = products.find((p) => p.id === event.product_id);
        return (
          <li
            key={event.id}
            className={cn(
              "relative pl-6 py-3",
              i !== list.length - 1 && "border-b border-border"
            )}
          >
            <span
              className={cn(
                "absolute left-0 top-4 h-1.5 w-1.5 rounded-full",
                meta.tone === "text-fg-muted"
                  ? "bg-fg-muted"
                  : "bg-current",
                meta.tone
              )}
            />
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm leading-snug">
                <span className={cn("font-medium", meta.tone)}>
                  {meta.label}
                </span>
                {product && (
                  <>
                    <span className="text-fg-muted"> · </span>
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-fg hover:text-accent transition-colors font-medium"
                    >
                      {product.name}
                    </Link>
                  </>
                )}
              </p>
              <time className="text-2xs text-fg-muted num shrink-0">
                {formatRelative(new Date(event.created_at))}
              </time>
            </div>
            {event.notes && (
              <p className="mt-1 text-xs text-fg-muted leading-relaxed">
                {event.notes}
              </p>
            )}
            {event.agent && (
              <p className="mt-1.5 text-2xs uppercase tracking-widest text-fg-muted/80">
                by {event.agent}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}

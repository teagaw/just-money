import { Star } from "lucide-react";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Review } from "@/lib/types";

export function ReviewsList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-fg-muted text-center py-8">
        No reviews yet. Reviews will appear here as they come in.
      </p>
    );
  }
  return (
    <ol className="space-y-3">
      {reviews.map((r) => (
        <li
          key={r.id}
          className="rounded-md border border-border bg-surface p-4"
        >
          <div className="flex items-center justify-between gap-2">
            <Stars rating={r.rating} />
            <time className="text-2xs text-fg-muted num">
              {formatRelative(new Date(r.created_at))}
            </time>
          </div>
          {r.comment && (
            <p className="mt-2 text-sm text-fg leading-relaxed">{r.comment}</p>
          )}
          {r.marketplace && (
            <p className="mt-2 text-2xs uppercase tracking-widest text-fg-muted">
              via {r.marketplace}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < rating
              ? "fill-accent text-accent"
              : "text-border"
          )}
        />
      ))}
    </div>
  );
}

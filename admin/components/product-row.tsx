import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LineBadge, StatusPill } from "./status";
import { formatCurrency, formatNumber, formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ProductWithStats } from "@/lib/types";

export function ProductRow({
  product,
  trailing,
  className,
}: {
  product: ProductWithStats;
  trailing?: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "flex items-center gap-4 py-3 px-4 border-b border-border last:border-0 hover:bg-surface-2/50 transition-colors group",
        className
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2.5">
          <p className="text-sm font-medium truncate">{product.name}</p>
          <StatusPill status={product.status} className="hidden sm:inline-flex" />
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs text-fg-muted">
          <LineBadge line={product.line} />
          <span className="text-border">·</span>
          <span className="num">{formatCurrency(product.price_cents)}</span>
          <span className="text-border">·</span>
          <span className="num">
            {formatNumber(product.sales_count)} sold
          </span>
          {product.avg_rating && (
            <>
              <span className="text-border">·</span>
              <span className="num">★ {product.avg_rating.toFixed(1)}</span>
            </>
          )}
        </div>
      </div>
      {trailing ?? (
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden md:inline text-2xs text-fg-muted num">
            {formatRelative(new Date(product.updated_at))}
          </span>
          <ArrowUpRight className="h-4 w-4 text-fg-muted group-hover:text-accent transition-colors" />
        </div>
      )}
    </Link>
  );
}

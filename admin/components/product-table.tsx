"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpDown, Filter, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import { StatusPill, LineBadge } from "./status";
import { PRODUCT_LINES, PRODUCT_STATUSES, LINE_LABELS, STATUS_LABELS, type ProductStatus, type ProductLine, type ProductWithStats } from "@/lib/types";

type SortKey = "name" | "line" | "price" | "status" | "sales" | "rating" | "created_at";
type SortDir = "asc" | "desc";

export function ProductTable({
  products,
}: {
  products: ProductWithStats[];
}) {
  const [query, setQuery] = useState("");
  const [line, setLine] = useState<ProductLine | "all">("all");
  const [status, setStatus] = useState<ProductStatus | "all">("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({
    key: "created_at",
    dir: "desc",
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products
      .filter((p) => (line === "all" ? true : p.line === line))
      .filter((p) => (status === "all" ? true : p.status === status))
      .filter((p) => (q ? p.name.toLowerCase().includes(q) : true))
      .sort((a, b) => {
        const dir = sort.dir === "asc" ? 1 : -1;
        switch (sort.key) {
          case "name":
            return a.name.localeCompare(b.name) * dir;
          case "line":
            return a.line.localeCompare(b.line) * dir;
          case "price":
            return (a.price_cents - b.price_cents) * dir;
          case "status":
            return a.status.localeCompare(b.status) * dir;
          case "sales":
            return (a.sales_count - b.sales_count) * dir;
          case "rating":
            return ((a.avg_rating ?? 0) - (b.avg_rating ?? 0)) * dir;
          case "created_at":
            return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * dir;
        }
      });
  }, [products, line, status, query, sort]);

  const onSort = (key: SortKey) =>
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "name" || key === "line" ? "asc" : "desc" }
    );

  return (
    <div className="surface overflow-hidden">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 border-b border-border">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-fg-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="w-full h-9 pl-8 pr-3 rounded-md bg-surface-2 border border-border text-sm placeholder:text-fg-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-2xs uppercase tracking-widest text-fg-muted">
            <Filter className="h-3 w-3" />
            Filter
          </div>
          <select
            value={line}
            onChange={(e) => setLine(e.target.value as ProductLine | "all")}
            className="h-9 rounded-md bg-surface-2 border border-border text-sm px-2.5 focus:border-accent focus:outline-none"
          >
            <option value="all">All lines</option>
            {PRODUCT_LINES.map((l) => (
              <option key={l} value={l}>
                {LINE_LABELS[l]}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ProductStatus | "all")}
            className="h-9 rounded-md bg-surface-2 border border-border text-sm px-2.5 focus:border-accent focus:outline-none"
          >
            <option value="all">All statuses</option>
            {PRODUCT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-2xs uppercase tracking-widest text-fg-muted border-b border-border bg-surface-2/40">
              <Th onClick={() => onSort("name")} active={sort.key === "name"} dir={sort.dir} className="min-w-[220px]">
                Product
              </Th>
              <Th onClick={() => onSort("line")} active={sort.key === "line"} dir={sort.dir} className="w-28">
                Line
              </Th>
              <Th onClick={() => onSort("status")} active={sort.key === "status"} dir={sort.dir} className="w-32">
                Status
              </Th>
              <Th onClick={() => onSort("price")} active={sort.key === "price"} dir={sort.dir} className="w-24 text-right">
                Price
              </Th>
              <Th onClick={() => onSort("sales")} active={sort.key === "sales"} dir={sort.dir} className="w-20 text-right">
                Sales
              </Th>
              <Th onClick={() => onSort("rating")} active={sort.key === "rating"} dir={sort.dir} className="w-20 text-right">
                Rating
              </Th>
              <Th onClick={() => onSort("created_at")} active={sort.key === "created_at"} dir={sort.dir} className="w-24 text-right">
                Created
              </Th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-sm text-fg-muted">
                  No products match these filters.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-border last:border-0 hover:bg-surface-2/60 transition-colors group"
                >
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/products/${p.slug}`}
                      className="font-medium text-fg group-hover:text-accent transition-colors"
                    >
                      {p.name}
                    </Link>
                    <p className="text-2xs text-fg-muted mt-0.5 font-mono">
                      /{p.slug}
                    </p>
                  </td>
                  <td className="px-3 py-3.5">
                    <LineBadge line={p.line} />
                  </td>
                  <td className="px-3 py-3.5">
                    <StatusPill status={p.status} />
                  </td>
                  <td className="px-3 py-3.5 text-right num font-medium">
                    {formatCurrency(p.price_cents)}
                  </td>
                  <td className="px-3 py-3.5 text-right num">
                    {formatNumber(p.sales_count)}
                  </td>
                  <td className="px-3 py-3.5 text-right num">
                    {p.avg_rating ? p.avg_rating.toFixed(1) : "—"}
                  </td>
                  <td className="px-5 py-3.5 text-right text-fg-muted text-xs num">
                    {formatDate(p.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 border-t border-border flex items-center justify-between text-xs text-fg-muted">
        <span>
          Showing <span className="text-fg num font-medium">{filtered.length}</span>{" "}
          of <span className="text-fg num font-medium">{products.length}</span>
        </span>
        <span className="text-2xs uppercase tracking-widest">
          Click any row to open
        </span>
      </div>
    </div>
  );
}

function Th({
  children,
  onClick,
  active,
  dir,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active: boolean;
  dir: SortDir;
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={cn(
        "px-3 py-3 font-medium text-left",
        className
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "inline-flex items-center gap-1.5 hover:text-fg transition-colors",
          active && "text-fg"
        )}
      >
        {children}
        <ArrowUpDown
          className={cn(
            "h-3 w-3 transition-opacity",
            active ? "opacity-100" : "opacity-40"
          )}
        />
        {active && (
          <span className="text-2xs">{dir === "asc" ? "↑" : "↓"}</span>
        )}
      </button>
    </th>
  );
}

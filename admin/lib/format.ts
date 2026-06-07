// Currency, date, and number formatting helpers.
// Tabular figures across the board so columns line up.

export function formatCurrency(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function formatNumber(n: number, opts?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    ...opts,
  }).format(n);
}

export function formatCompact(n: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function formatPercent(value: number, fractionDigits = 1): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatDate(input: string | Date, style: "short" | "long" | "relative" = "short"): string {
  const date = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) return "—";

  if (style === "relative") {
    return formatRelative(date);
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: style === "long" ? "numeric" : undefined,
  }).format(date);
}

export function formatRelative(date: Date): string {
  const diffMs = date.getTime() - Date.now();
  const diffSec = Math.round(diffMs / 1000);
  const rtf = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });
  const absSec = Math.abs(diffSec);
  if (absSec < 60) return rtf.format(diffSec, "second");
  if (absSec < 3600) return rtf.format(Math.round(diffSec / 60), "minute");
  if (absSec < 86400) return rtf.format(Math.round(diffSec / 3600), "hour");
  if (absSec < 604800) return rtf.format(Math.round(diffSec / 86400), "day");
  if (absSec < 2592000) return rtf.format(Math.round(diffSec / 604800), "week");
  if (absSec < 31536000) return rtf.format(Math.round(diffSec / 2592000), "month");
  return rtf.format(Math.round(diffSec / 31536000), "year");
}

export function daysBetween(start: string | Date, end: string | Date = new Date()): number {
  const s = typeof start === "string" ? new Date(start) : start;
  const e = typeof end === "string" ? new Date(end) : end;
  return Math.max(0, Math.floor((e.getTime() - s.getTime()) / 86400000));
}

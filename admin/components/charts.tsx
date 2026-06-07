"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "./theme-provider";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";

function useChartTheme() {
  const { theme } = useTheme();
  // Read CSS variable values for axis / grid (matches current theme)
  const isDark = theme === "dark";
  return {
    grid: isDark ? "oklch(26% 0.015 145 / 0.6)" : "oklch(88% 0.01 145 / 0.8)",
    axis: isDark ? "oklch(68% 0.012 145 / 0.7)" : "oklch(42% 0.012 145)",
    surface: isDark ? "oklch(16% 0.013 145)" : "oklch(96.5% 0.006 145)",
    fg: isDark ? "oklch(96% 0.008 145)" : "oklch(18% 0.015 145)",
    accent: "oklch(80% 0.21 145)",
    accentSoft: "oklch(80% 0.21 145 / 0.18)",
  };
}

interface TooltipPayloadItem {
  value?: number | string;
  name?: string;
  color?: string;
  dataKey?: string;
  payload?: Record<string, unknown>;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
  valueFormatter?: (v: number) => string;
}

function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter,
}: ChartTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-md border border-border bg-surface-2 px-3 py-2 shadow-lg shadow-black/20">
      {label !== undefined && label !== "" && (
        <p className="text-2xs uppercase tracking-widest text-fg-muted">
          {String(label)}
        </p>
      )}
      <div className="mt-1 space-y-0.5">
        {payload.map((p, i) => {
          const raw = typeof p.value === "number" ? p.value : Number(p.value ?? 0);
          return (
            <p key={`${p.dataKey ?? p.name ?? i}`} className="text-sm num font-medium">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full mr-1.5 align-middle"
                style={{ background: p.color ?? "oklch(80% 0.21 145)" }}
              />
              {valueFormatter ? valueFormatter(raw) : String(p.value ?? "")}
            </p>
          );
        })}
      </div>
    </div>
  );
}

type RechartsTooltipProps = React.ComponentProps<typeof Tooltip>;

function makeTooltip(
  formatLabel?: (label: string) => string,
  valueFormatter?: (v: number) => string,
) {
  return function TooltipContent(props: RechartsTooltipProps) {
    const label =
      props.label !== undefined && props.label !== null && props.label !== ""
        ? formatLabel
          ? formatLabel(String(props.label))
          : String(props.label)
        : undefined;
    return (
      <ChartTooltip
        active={props.active}
        payload={(props.payload ?? []) as TooltipPayloadItem[]}
        label={label}
        valueFormatter={valueFormatter}
      />
    );
  };
}

export function ListingsLineChart({
  data,
}: {
  data: { date: string; count: number }[];
}) {
  const t = useChartTheme();
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="listingsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={t.accent} stopOpacity={0.45} />
              <stop offset="100%" stopColor={t.accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={t.grid} strokeDasharray="2 4" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: t.axis, fontSize: 10, fontFamily: "var(--font-inter)" }}
            tickFormatter={(v) => formatDate(v)}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={28}
          />
          <YAxis
            tick={{ fill: t.axis, fontSize: 10, fontFamily: "var(--font-inter)" }}
            axisLine={false}
            tickLine={false}
            width={32}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ stroke: t.accent, strokeOpacity: 0.4, strokeDasharray: "3 3" }}
            content={makeTooltip(
              (l) => formatDate(l, "long"),
              (v) => `${formatNumber(v)} listed`
            )}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke={t.accent}
            strokeWidth={2}
            fill="url(#listingsFill)"
            activeDot={{ r: 4, fill: t.accent, stroke: t.surface, strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RevenueAreaChart({
  data,
}: {
  data: { date: string; revenue: number }[];
}) {
  const t = useChartTheme();
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={t.accent} stopOpacity={0.4} />
              <stop offset="100%" stopColor={t.accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={t.grid} strokeDasharray="2 4" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: t.axis, fontSize: 10, fontFamily: "var(--font-inter)" }}
            tickFormatter={(v) => formatDate(v)}
            axisLine={false}
            tickLine={false}
            minTickGap={28}
          />
          <YAxis
            tick={{ fill: t.axis, fontSize: 10, fontFamily: "var(--font-inter)" }}
            tickFormatter={(v) => `$${Math.round(v / 100)}`}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip
            cursor={{ stroke: t.accent, strokeOpacity: 0.4 }}
            content={makeTooltip(
              (l) => formatDate(l, "long"),
              (v) => formatCurrency(v)
            )}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke={t.accent}
            strokeWidth={2}
            fill="url(#revenueFill)"
            activeDot={{ r: 4, fill: t.accent, stroke: t.surface, strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

const LINE_COLORS: Record<string, string> = {
  notion: "oklch(96% 0.008 145)",
  canva: "oklch(80% 0.21 145)",
  prompts: "oklch(76% 0.13 240)",
  spreadsheets: "oklch(82% 0.15 80)",
  resume: "oklch(70% 0.22 25)",
};

export function RevenueByLineBarChart({
  data,
}: {
  data: { line: string; revenue: number }[];
}) {
  const t = useChartTheme();
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          barCategoryGap={20}
        >
          <CartesianGrid stroke={t.grid} strokeDasharray="2 4" vertical={false} />
          <XAxis
            dataKey="line"
            tick={{ fill: t.axis, fontSize: 11, fontFamily: "var(--font-inter)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v.charAt(0).toUpperCase() + v.slice(1)}
          />
          <YAxis
            tick={{ fill: t.axis, fontSize: 10, fontFamily: "var(--font-inter)" }}
            tickFormatter={(v) => `$${Math.round(v / 100)}`}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip
            cursor={{ fill: t.accentSoft }}
            content={makeTooltip(undefined, (v) => formatCurrency(v))}
          />
          <Bar dataKey="revenue" radius={[4, 4, 0, 0]} maxBarSize={56}>
            {data.map((entry) => (
              <Cell
                key={entry.line}
                fill={LINE_COLORS[entry.line] ?? t.accent}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SalesHistoryBarChart({
  data,
}: {
  data: { date: string; sales: number }[];
}) {
  const t = useChartTheme();
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          barCategoryGap={6}
        >
          <CartesianGrid stroke={t.grid} strokeDasharray="2 4" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: t.axis, fontSize: 10, fontFamily: "var(--font-inter)" }}
            tickFormatter={(v) => formatDate(v)}
            axisLine={false}
            tickLine={false}
            minTickGap={20}
          />
          <YAxis
            tick={{ fill: t.axis, fontSize: 10, fontFamily: "var(--font-inter)" }}
            axisLine={false}
            tickLine={false}
            width={28}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: t.accentSoft }}
            content={makeTooltip(
              (l) => formatDate(l, "long"),
              (v) => `${v} sales`
            )}
          />
          <Bar dataKey="sales" fill={t.accent} radius={[3, 3, 0, 0]} maxBarSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

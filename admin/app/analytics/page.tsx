import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/card";
import { KpiCard } from "@/components/kpi-card";
import { CsvExport } from "@/components/csv-export";
import { LineBadge } from "@/components/status";
import { RevenueAreaChart, RevenueByLineBarChart } from "@/components/charts";
import {
  MOCK_PRODUCTS,
  TOP_KEYWORDS,
  getBestSellers,
  getConversionByLine,
  getRevenueByDay,
  getRevenueByLine,
  getWorstSellers,
} from "@/lib/mock-data";
import { formatCompact, formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import type { ProductLine } from "@/lib/types";

export default function AnalyticsPage() {
  const products = MOCK_PRODUCTS;
  const best = getBestSellers(5);
  const worst = getWorstSellers(5);
  const totalRevenue = products.reduce((s, p) => s + p.total_revenue_cents, 0);
  const totalSales = products.reduce((s, p) => s + p.sales_count, 0);
  const conversion = getConversionByLine();
  const overallConversion = totalSales / Math.max(1, products.filter((p) => p.status === "listed").length);

  return (
    <>
      <PageHeader
        eyebrow="Analytics"
        title="Sales & conversion"
        description="Where revenue comes from, what converts, and what to retire."
        actions={
          <CsvExport
            filename="products"
            data={products.map((p) => ({
              name: p.name,
              line: p.line,
              status: p.status,
              price_cents: p.price_cents,
              sales: p.sales_count,
              revenue_cents: p.total_revenue_cents,
              rating: p.avg_rating ?? "",
              created_at: p.created_at,
            }))}
            headers={[
              { key: "name", label: "Name" },
              { key: "line", label: "Line" },
              { key: "status", label: "Status" },
              { key: "price_cents", label: "Price (cents)" },
              { key: "sales", label: "Sales" },
              { key: "revenue_cents", label: "Revenue (cents)" },
              { key: "rating", label: "Avg rating" },
              { key: "created_at", label: "Created" },
            ]}
          />
        }
      />

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total revenue"
          value={formatCurrency(totalRevenue)}
          hint="All time, across marketplaces"
          trend="up"
          trendValue="mock"
        />
        <KpiCard
          label="Total sales"
          value={formatNumber(totalSales)}
          hint={`${formatCompact(totalRevenue / Math.max(1, totalSales))} AOV`}
        />
        <KpiCard
          label="Conversion"
          value={formatPercent(overallConversion, 0)}
          hint="Sales per listed product"
        />
        <KpiCard
          label="Active SKUs"
          value={formatNumber(products.filter((p) => p.status === "listed").length)}
          hint={`${products.length} total in catalog`}
        />
      </div>

      <div className="mt-6 grid gap-4 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Revenue over time</CardTitle>
              <CardDescription>Last 30 days, all marketplaces.</CardDescription>
            </div>
          </CardHeader>
          <CardBody>
            <RevenueAreaChart data={getRevenueByDay(30)} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Revenue by line</CardTitle>
              <CardDescription>Top earners per product line.</CardDescription>
            </div>
          </CardHeader>
          <CardBody>
            <RevenueByLineBarChart data={getRevenueByLine()} />
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Best sellers</CardTitle>
              <CardDescription>Top 5 by units sold.</CardDescription>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <ol>
              {best.map((p, i) => (
                <li
                  key={p.id}
                  className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-0"
                >
                  <span className="font-mono text-2xs text-fg-muted w-6 num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-2xs text-fg-muted mt-0.5 flex items-center gap-2">
                      <LineBadge line={p.line as ProductLine} />
                      <span>·</span>
                      <span className="num">{formatCurrency(p.total_revenue_cents)}</span>
                    </p>
                  </div>
                  <span className="num text-sm font-semibold text-accent">
                    {p.sales_count}
                  </span>
                </li>
              ))}
            </ol>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Worst sellers</CardTitle>
              <CardDescription>Listed but barely moving. Consider retiring.</CardDescription>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <ol>
              {worst.map((p, i) => (
                <li
                  key={p.id}
                  className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-0"
                >
                  <span className="font-mono text-2xs text-fg-muted w-6 num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-2xs text-fg-muted mt-0.5 flex items-center gap-2">
                      <LineBadge line={p.line as ProductLine} />
                      <span>·</span>
                      <span className="num">{formatCurrency(p.price_cents)}</span>
                    </p>
                  </div>
                  <span className="num text-sm font-medium text-danger inline-flex items-center gap-1">
                    <ArrowDownRight className="h-3.5 w-3.5" />
                    {p.sales_count}
                  </span>
                </li>
              ))}
            </ol>
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Conversion by line</CardTitle>
              <CardDescription>Sales per listed SKU, grouped.</CardDescription>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-2xs uppercase tracking-widest text-fg-muted border-b border-border">
                  <th className="text-left font-medium px-4 py-2.5">Line</th>
                  <th className="text-right font-medium px-3 py-2.5">Listed</th>
                  <th className="text-right font-medium px-3 py-2.5">Sales</th>
                  <th className="text-right font-medium px-4 py-2.5">Sales / SKU</th>
                </tr>
              </thead>
              <tbody>
                {conversion.map((c) => (
                  <tr key={c.line} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <LineBadge line={c.line as ProductLine} />
                    </td>
                    <td className="px-3 py-3 text-right num">{c.listed}</td>
                    <td className="px-3 py-3 text-right num">{c.sales}</td>
                    <td className="px-4 py-3 text-right num font-semibold">
                      {c.rate.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Top search keywords</CardTitle>
              <CardDescription>
                Mock trend data. Wire to Etsy / Gumroad analytics to replace.
              </CardDescription>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <ol>
              {TOP_KEYWORDS.map((k, i) => (
                <li
                  key={k.keyword}
                  className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-0"
                >
                  <span className="font-mono text-2xs text-fg-muted w-6 num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{k.keyword}</p>
                    <p className="text-2xs text-fg-muted mt-0.5 num">
                      {formatNumber(k.searches)} searches
                    </p>
                  </div>
                  <span className="num text-sm font-semibold text-accent inline-flex items-center gap-1">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    {formatPercent(k.conversion, 1)}
                  </span>
                </li>
              ))}
            </ol>
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 mb-12" />
    </>
  );
}

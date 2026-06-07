import { LineBadge } from "@/components/status";
import { ProductRow } from "@/components/product-row";
import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { AddProductButton } from "@/components/add-product-button";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/card";
import { ListingsLineChart, RevenueByLineBarChart } from "@/components/charts";
import { ActivityFeed } from "@/components/activity-feed";
import {
  getProductsByDay,
  getRevenueByLine,
} from "@/lib/mock-data";
import {
  getDashboardStatsServer,
  getProductsServer,
  getProductionEventsServer,
} from "@/lib/supabase-server";
import { formatCurrency, formatNumber } from "@/lib/format";

export default async function DashboardHome() {
  const [stats, products, events] = await Promise.all([
    getDashboardStatsServer(),
    getProductsServer(),
    getProductionEventsServer(),
  ]);
  const reviews = stats.reviews;

  const totalRatingSum = reviews.reduce((s, r) => s + r.rating, 0);
  const avgRating = reviews.length > 0 ? totalRatingSum / reviews.length : null;

  const listingsTrend =
    stats.listingsPrev7 > 0
      ? ((stats.listingsLast7 - stats.listingsPrev7) / stats.listingsPrev7) * 100
      : stats.listingsLast7 > 0
        ? 100
        : 0;

  const revenueTrend =
    stats.revenuePrev7Cents > 0
      ? ((stats.revenueLast7Cents - stats.revenuePrev7Cents) /
          stats.revenuePrev7Cents) *
        100
      : stats.revenueLast7Cents > 0
        ? 100
        : 0;

  const lineRevenue = getRevenueByLine();
  const bestLine = lineRevenue[0];

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Empire dashboard"
        description="Production health, sales velocity, and what to ship next. All numbers update when you connect Supabase."
        actions={<AddProductButton />}
      />

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total products"
          value={formatNumber(stats.totalProducts)}
          hint={`${stats.listedCount} live, ${stats.totalProducts - stats.listedCount} in pipeline`}
          trend={listingsTrend > 0 ? "up" : listingsTrend < 0 ? "down" : "flat"}
          trendValue={`${listingsTrend > 0 ? "+" : ""}${listingsTrend.toFixed(0)}% wk`}
        />
        <KpiCard
          label="Listed"
          value={formatNumber(stats.listedCount)}
          hint={`${((stats.listedCount / Math.max(1, stats.totalProducts)) * 100).toFixed(0)}% of catalog`}
        />
        <KpiCard
          label="Revenue (30d)"
          value={formatCurrency(stats.totalRevenueCents)}
          hint={
            bestLine
              ? `Best line: ${bestLine.line} (${formatCurrency(bestLine.revenue)})`
              : "No sales yet"
          }
          trend={revenueTrend > 0 ? "up" : revenueTrend < 0 ? "down" : "flat"}
          trendValue={`${revenueTrend > 0 ? "+" : ""}${revenueTrend.toFixed(0)}% wk`}
        />
        <KpiCard
          label="Avg rating"
          value={avgRating !== null ? avgRating.toFixed(2) : "—"}
          hint={`${reviews.length} reviews`}
        />
      </div>

      <div className="mt-6 grid gap-4 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Listings per day</CardTitle>
              <CardDescription>Products created in the last 30 days.</CardDescription>
            </div>
            <span className="chip chip-accent">last 30d</span>
          </CardHeader>
          <CardBody>
            <ListingsLineChart data={getProductsByDay(30)} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Revenue by line</CardTitle>
              <CardDescription>Mock totals, by product line.</CardDescription>
            </div>
          </CardHeader>
          <CardBody>
            <RevenueByLineBarChart data={lineRevenue} />
            <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
              {lineRevenue.map((l) => (
                <li
                  key={l.line}
                  className="flex items-center justify-between gap-2"
                >
                  <LineBadge line={l.line as never} />
                  <span className="num font-medium text-fg">
                    {formatCurrency(l.revenue)}
                  </span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Recent products</CardTitle>
              <CardDescription>Click any row to open the detail page.</CardDescription>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            {products
              .slice()
              .sort((a, b) =>
                a.created_at < b.created_at ? 1 : -1
              )
              .slice(0, 6)
              .map((p) => (
                <ProductRow key={p.id} product={p} />
              ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Activity</CardTitle>
              <CardDescription>Latest production events.</CardDescription>
            </div>
          </CardHeader>
          <CardBody className="px-0 pb-0">
            <ActivityFeed
              events={events}
              products={products}
              limit={8}
            />
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 mb-12 text-xs text-fg-muted flex flex-wrap items-center gap-3">
        <span className="text-2xs uppercase tracking-widest">Showing</span>
        <span className="chip">{formatNumber(products.length)} products</span>
        <span className="chip">{formatNumber(reviews.length)} reviews</span>
        <span className="chip">{formatNumber(events.length)} events</span>
      </div>
    </>
  );
}

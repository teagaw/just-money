import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/card";
import { LineBadge, StatusPill } from "@/components/status";
import { ReviewsList } from "@/components/reviews-list";
import { SalesHistoryBarChart } from "@/components/charts";
import { ActivityFeed } from "@/components/activity-feed";
import { ProductEditForm } from "@/components/product-edit-form";
import {
  getProductServer,
  getReviewsServer,
  getProductionEventsServer,
  getSalesServer,
} from "@/lib/supabase-server";
import type { ProductLine, ProductStatus } from "@/lib/types";
import { LINE_LABELS } from "@/lib/types";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductServer(params.slug);
  if (!product) notFound();

  const [reviews, events, sales] = await Promise.all([
    getReviewsServer(product.id),
    getProductionEventsServer(product.id),
    getSalesServer(product.id),
  ]);

  const last30 = new Date();
  last30.setUTCDate(last30.getUTCDate() - 30);
  const salesByDay = new Map<string, number>();
  for (const s of sales) {
    if (new Date(s.occurred_at).getTime() >= last30.getTime()) {
      const key = s.occurred_at.slice(0, 10);
      salesByDay.set(key, (salesByDay.get(key) ?? 0) + 1);
    }
  }
  const salesHistory = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setUTCHours(0, 0, 0, 0);
    d.setUTCDate(d.getUTCDate() - (29 - i));
    const key = d.toISOString().slice(0, 10);
    return { date: key, sales: salesByDay.get(key) ?? 0 };
  });

  return (
    <>
      <div className="pt-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs text-fg-muted hover:text-fg transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All products
        </Link>
      </div>

      <PageHeader
        eyebrow={LINE_LABELS[product.line as ProductLine]}
        title={product.name}
        description={`Listed ${formatDate(product.created_at, "long")}. Slug: ${product.slug}`}
        actions={
          <div className="flex items-center gap-2">
            <StatusPill status={product.status as ProductStatus} />
            {product.listing_url_etsy && (
              <a
                href={product.listing_url_etsy}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-fg-muted hover:text-fg"
              >
                Etsy <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {product.listing_url_gumroad && (
              <a
                href={product.listing_url_gumroad}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-fg-muted hover:text-fg"
              >
                Gumroad <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        }
      />

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Edit details</CardTitle>
              <CardDescription>
                Changes save to Supabase when connected. In mock mode, this is local.
              </CardDescription>
            </div>
          </CardHeader>
          <CardBody>
            <ProductEditForm product={product} />
          </CardBody>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardBody>
              <dl className="grid grid-cols-2 gap-y-4 text-sm">
                <dt className="text-fg-muted">Sales</dt>
                <dd className="text-right num font-medium">
                  {formatNumber(product.sales_count)}
                </dd>
                <dt className="text-fg-muted">Revenue</dt>
                <dd className="text-right num font-medium text-accent">
                  {formatCurrency(product.total_revenue_cents)}
                </dd>
                <dt className="text-fg-muted">Reviews</dt>
                <dd className="text-right num font-medium">
                  {formatNumber(reviews.length)}
                </dd>
                <dt className="text-fg-muted">Avg rating</dt>
                <dd className="text-right num font-medium">
                  {product.avg_rating
                    ? `★ ${product.avg_rating.toFixed(2)}`
                    : "—"}
                </dd>
                <dt className="text-fg-muted">Line</dt>
                <dd className="text-right">
                  <LineBadge line={product.line as ProductLine} />
                </dd>
                <dt className="text-fg-muted">Slug</dt>
                <dd className="text-right font-mono text-xs text-fg-muted">
                  {product.slug}
                </dd>
              </dl>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sales history</CardTitle>
              <CardDescription>Last 30 days.</CardDescription>
            </CardHeader>
            <CardBody>
              <SalesHistoryBarChart data={salesHistory} />
            </CardBody>
          </Card>
        </div>
      </div>

      <div className="mt-6 grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Reviews</CardTitle>
              <CardDescription>
                {reviews.length} reviews · {product.avg_rating?.toFixed(2) ?? "—"} avg
              </CardDescription>
            </div>
          </CardHeader>
          <CardBody>
            <ReviewsList reviews={reviews} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Critique history</CardTitle>
              <CardDescription>Production events for this product.</CardDescription>
            </div>
          </CardHeader>
          <CardBody className="px-0 pb-0">
            <ActivityFeed events={events} products={[product]} />
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 mb-12" />
    </>
  );
}

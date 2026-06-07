// Server-only Supabase client + helpers.
// All functions fall back to in-memory mock data when Supabase env vars
// are not configured, so the app is fully functional without a project.

import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import {
  MOCK_PRODUCTS,
  MOCK_REVIEWS,
  MOCK_SALES,
  MOCK_EVENTS,
} from "./mock-data";
import { isMockMode } from "./supabase";
import type {
  ProductLine,
  ProductStatus,
  ProductWithStats,
  ProductionEvent,
  Review,
  Sale,
} from "./types";

export { isMockMode };

function getServerSupabase() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll() {
          return cookies().getAll();
        },
        setAll(toSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            for (const { name, value, options } of toSet) {
              cookies().set(name, value, options);
            }
          } catch {
            // no-op when called from a Server Component
          }
        },
      },
    }
  );
}

export async function getProductsServer(): Promise<ProductWithStats[]> {
  if (isMockMode()) return MOCK_PRODUCTS;
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("products_with_stats")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ProductWithStats[];
}

export async function getProductServer(
  slug: string,
): Promise<ProductWithStats | null> {
  if (isMockMode()) {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("products_with_stats")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return (data as ProductWithStats | null) ?? null;
}

export async function getSalesServer(productId?: string): Promise<Sale[]> {
  if (isMockMode()) {
    return productId
      ? MOCK_SALES.filter((s) => s.product_id === productId)
      : MOCK_SALES;
  }
  const supabase = getServerSupabase();
  let query = supabase.from("sales").select("*").order("occurred_at", {
    ascending: false,
  });
  if (productId) query = query.eq("product_id", productId);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Sale[];
}

export async function getReviewsServer(productId?: string): Promise<Review[]> {
  if (isMockMode()) {
    return productId
      ? MOCK_REVIEWS.filter((r) => r.product_id === productId)
      : MOCK_REVIEWS;
  }
  const supabase = getServerSupabase();
  let query = supabase.from("reviews").select("*").order("created_at", {
    ascending: false,
  });
  if (productId) query = query.eq("product_id", productId);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Review[];
}

export async function getProductionEventsServer(
  productId?: string,
): Promise<ProductionEvent[]> {
  if (isMockMode()) {
    return productId
      ? MOCK_EVENTS.filter((e) => e.product_id === productId)
      : MOCK_EVENTS;
  }
  const supabase = getServerSupabase();
  let query = supabase
    .from("production_events")
    .select("*")
    .order("created_at", { ascending: false });
  if (productId) query = query.eq("product_id", productId);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ProductionEvent[];
}

export type CreateProductInput = {
  name: string;
  line: ProductLine;
  status: ProductStatus;
  priceCents: number;
  slug: string;
  notes?: string;
};

export async function createProductServer(
  input: CreateProductInput,
): Promise<ProductWithStats> {
  const now = new Date().toISOString();
  if (isMockMode()) {
    const id = `mock-${Date.now().toString(36)}`;
    const product: ProductWithStats = {
      id,
      slug: input.slug,
      line: input.line,
      name: input.name,
      price_cents: input.priceCents,
      status: input.status,
      cover_image_url: null,
      listing_url_etsy: null,
      listing_url_gumroad: null,
      listing_url_other: null,
      created_at: now,
      updated_at: now,
      sales_count: 0,
      total_revenue_cents: 0,
      avg_rating: null,
      review_count: 0,
    };
    MOCK_PRODUCTS.unshift(product);
    MOCK_EVENTS.unshift({
      id: `event-${id}-idea`,
      product_id: id,
      event_type: "idea_added",
      agent: "operator",
      notes: input.notes ?? null,
      created_at: now,
    });
    return product;
  }
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("products")
    .insert({
      slug: input.slug,
      line: input.line,
      name: input.name,
      price_cents: input.priceCents,
      status: input.status,
    })
    .select("*")
    .single();
  if (error) throw error;
  await supabase.from("production_events").insert({
    product_id: data.id,
    event_type: "idea_added",
    agent: "operator",
    notes: input.notes ?? null,
  });
  return {
    ...(data as Omit<ProductWithStats, "sales_count" | "total_revenue_cents" | "avg_rating" | "review_count">),
    sales_count: 0,
    total_revenue_cents: 0,
    avg_rating: null,
    review_count: 0,
  };
}

export type UpdateProductInput = {
  name?: string;
  line?: ProductLine;
  status?: ProductStatus;
  priceCents?: number;
  listingUrlEtsy?: string | null;
  listingUrlGumroad?: string | null;
  coverImageUrl?: string | null;
};

export async function updateProductServer(
  id: string,
  input: UpdateProductInput,
): Promise<void> {
  if (isMockMode()) {
    const idx = MOCK_PRODUCTS.findIndex((p) => p.id === id);
    if (idx >= 0) {
      const p = MOCK_PRODUCTS[idx];
      MOCK_PRODUCTS[idx] = {
        ...p,
        name: input.name ?? p.name,
        line: input.line ?? p.line,
        status: input.status ?? p.status,
        price_cents: input.priceCents ?? p.price_cents,
        listing_url_etsy:
          input.listingUrlEtsy === undefined
            ? p.listing_url_etsy
            : input.listingUrlEtsy,
        listing_url_gumroad:
          input.listingUrlGumroad === undefined
            ? p.listing_url_gumroad
            : input.listingUrlGumroad,
        cover_image_url:
          input.coverImageUrl === undefined
            ? p.cover_image_url
            : input.coverImageUrl,
        updated_at: new Date().toISOString(),
      };
    }
    return;
  }
  const supabase = getServerSupabase();
  const patch: Record<string, unknown> = {};
  if (input.name !== undefined) patch.name = input.name;
  if (input.line !== undefined) patch.line = input.line;
  if (input.status !== undefined) patch.status = input.status;
  if (input.priceCents !== undefined) patch.price_cents = input.priceCents;
  if (input.listingUrlEtsy !== undefined)
    patch.listing_url_etsy = input.listingUrlEtsy;
  if (input.listingUrlGumroad !== undefined)
    patch.listing_url_gumroad = input.listingUrlGumroad;
  if (input.coverImageUrl !== undefined)
    patch.cover_image_url = input.coverImageUrl;
  const { error } = await supabase.from("products").update(patch).eq("id", id);
  if (error) throw error;
}

export async function moveProductStatusServer(
  id: string,
  status: ProductStatus,
): Promise<void> {
  if (isMockMode()) {
    const idx = MOCK_PRODUCTS.findIndex((p) => p.id === id);
    if (idx >= 0) {
      const p = MOCK_PRODUCTS[idx];
      MOCK_PRODUCTS[idx] = { ...p, status, updated_at: new Date().toISOString() };
    }
    return;
  }
  const supabase = getServerSupabase();
  const { error } = await supabase
    .from("products")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

export type DashboardStats = {
  totalProducts: number;
  listedCount: number;
  totalRevenueCents: number;
  revenueLast7Cents: number;
  revenuePrev7Cents: number;
  listingsLast7: number;
  listingsPrev7: number;
  reviews: Review[];
};

export async function getDashboardStatsServer(): Promise<DashboardStats> {
  const [products, reviews, sales] = await Promise.all([
    getProductsServer(),
    getReviewsServer(),
    getSalesServer(),
  ]);
  const now = Date.now();
  const day = 86_400_000;
  const listedCount = products.filter((p) => p.status === "listed").length;
  const totalRevenueCents = products.reduce(
    (s, p) => s + p.total_revenue_cents,
    0,
  );
  const inLast = (iso: string, fromDays: number, toDays = Infinity) => {
    const t = now - new Date(iso).getTime();
    return t >= fromDays * day && t < toDays * day;
  };
  const revenueLast7Cents = sales
    .filter((s) => now - new Date(s.occurred_at).getTime() <= 7 * day)
    .reduce((s, x) => s + x.amount_cents, 0);
  const revenuePrev7Cents = sales
    .filter((s) => inLast(s.occurred_at, 7, 14))
    .reduce((s, x) => s + x.amount_cents, 0);
  const listingsLast7 = products.filter((p) =>
    inLast(p.created_at, 0, 7),
  ).length;
  const listingsPrev7 = products.filter((p) =>
    inLast(p.created_at, 7, 14),
  ).length;
  return {
    totalProducts: products.length,
    listedCount,
    totalRevenueCents,
    revenueLast7Cents,
    revenuePrev7Cents,
    listingsLast7,
    listingsPrev7,
    reviews,
  };
}

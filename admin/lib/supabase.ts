// Client-safe Supabase helpers + mock data layer.
// Anything that touches `next/headers` lives in `./supabase-server.ts`.

import { createBrowserClient } from "@supabase/ssr";

import { MOCK_PRODUCTS } from "./mock-data";
import type { ProductWithStats, Review, Sale } from "./types";

export const isMockMode = () =>
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-ref");

/* ------------------------------------------------------------------
   Browser client (Client Components)
   ------------------------------------------------------------------ */
export function getBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/* ------------------------------------------------------------------
   Mock data layer
   Returns the same shape the real Supabase calls would, so the UI
   doesn't have to branch on mode.
   ------------------------------------------------------------------ */

export async function getProducts(): Promise<ProductWithStats[]> {
  if (isMockMode()) {
    return MOCK_PRODUCTS;
  }
  // Wire to: supabase.from('products_with_stats').select('*')
  return MOCK_PRODUCTS;
}

export async function getProductBySlug(slug: string): Promise<ProductWithStats | null> {
  if (isMockMode()) {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
  return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export async function getProductSales(_productId: string): Promise<Sale[]> {
  if (isMockMode()) {
    return [];
  }
  return [];
}

export async function getProductReviews(_productId: string): Promise<Review[]> {
  if (isMockMode()) {
    return [];
  }
  return [];
}

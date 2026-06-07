// Database types, matching supabase/schema.sql.
// Keep these in sync with the SQL when columns change.

export type ProductLine =
  | "notion"
  | "canva"
  | "prompts"
  | "spreadsheets"
  | "resume";

export const PRODUCT_LINES: ProductLine[] = [
  "notion",
  "canva",
  "prompts",
  "spreadsheets",
  "resume",
];

export const LINE_LABELS: Record<ProductLine, string> = {
  notion: "Notion",
  canva: "Canva",
  prompts: "Prompts",
  spreadsheets: "Sheets",
  resume: "Resume",
};

export type ProductStatus =
  | "idea"
  | "researching"
  | "building"
  | "critiquing"
  | "listed"
  | "archived";

export const PRODUCT_STATUSES: ProductStatus[] = [
  "idea",
  "researching",
  "building",
  "critiquing",
  "listed",
  "archived",
];

export const STATUS_LABELS: Record<ProductStatus, string> = {
  idea: "Idea",
  researching: "Researching",
  building: "Building",
  critiquing: "Critiquing",
  listed: "Listed",
  archived: "Archived",
};

export type Marketplace = "etsy" | "gumroad" | "stripe" | "other";

export const MARKETPLACES: Marketplace[] = ["etsy", "gumroad", "stripe", "other"];

export interface Product {
  id: string;
  slug: string;
  line: ProductLine;
  name: string;
  price_cents: number;
  status: ProductStatus;
  cover_image_url: string | null;
  listing_url_etsy: string | null;
  listing_url_gumroad: string | null;
  listing_url_other: string | null;
  created_at: string;
  updated_at: string;
}

export interface Sale {
  id: string;
  product_id: string;
  marketplace: Marketplace;
  amount_cents: number;
  occurred_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  rating: number;
  comment: string | null;
  marketplace: Marketplace | null;
  created_at: string;
}

export interface ProductionEvent {
  id: string;
  product_id: string;
  event_type: string;
  agent: string | null;
  notes: string | null;
  created_at: string;
}

export interface ProductWithStats extends Product {
  sales_count: number;
  total_revenue_cents: number;
  avg_rating: number | null;
  review_count: number;
}

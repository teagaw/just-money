// Mock data used when Supabase env vars are not set, or for design previews.
// All data is generated deterministically; no real product names are referenced.

import type {
  Product,
  ProductLine,
  ProductStatus,
  ProductWithStats,
  ProductionEvent,
  Review,
  Sale,
} from "./types";

const LINE_DISTRIBUTION: ProductLine[] = [
  "notion",
  "notion",
  "notion",
  "canva",
  "canva",
  "prompts",
  "prompts",
  "spreadsheets",
  "spreadsheets",
  "resume",
  "resume",
];

const STATUS_DISTRIBUTION: ProductStatus[] = [
  "listed",
  "listed",
  "listed",
  "listed",
  "listed",
  "listed",
  "listed",
  "building",
  "building",
  "critiquing",
  "researching",
  "idea",
  "idea",
  "archived",
];

const NAME_PATTERNS: Record<ProductLine, string[]> = {
  notion: [
    "Fitness Command Center",
    "Business OS Pro",
    "Creator Income Tracker",
    "Client Pipeline HQ",
    "Content Engine",
    "Second Brain Suite",
    "Habit Architect",
    "Project Atlas",
    "Solopreneur Dashboard",
    "Life OS 2026",
    "Brand Builder Kit",
    "Revenue Radar",
  ],
  canva: [
    "Instagram Story Vault",
    "Pitch Deck Studio",
    "Resume Pack Modern Tech",
    "Brand Kit Minimal",
    "Real Estate Bundle",
    "Wedding Invite Suite",
    "Course Creator Kit",
    "Newsletter Templates",
    "Coaching Workbook",
    "Restaurant Promo Pack",
    "Travel Itinerary Kit",
    "Podcast Cover Pack",
  ],
  prompts: [
    "Midjourney Editorial Pack",
    "ChatGPT System Library",
    "DALL-E Product Shots",
    "Stable Diffusion Style Bible",
    "Logo Forge Prompts",
    "Cinematic Portrait Pack",
    "Isometric World Builder",
    "UI Mood Board Prompts",
    "Brand Photography Prompts",
    "Ad Creative Generator",
    "Architecture Concept Pack",
    "3D Character Vault",
  ],
  spreadsheets: [
    "Budget Pro 2026",
    "Business Tracker Suite",
    "Content Calendar HQ",
    "Sales Pipeline Sheet",
    "Inventory Master",
    "Freelancer Income Sheet",
    "Rental Property Model",
    "Client Retainer Tracker",
    "Marketing ROI Dashboard",
    "Course Launch Planner",
    "Etsy Shop Analytics",
    "Subscription Tracker",
  ],
  resume: [
    "Modern Tech Resume",
    "Executive Brief",
    "Creative Director CV",
    "ATS-Optimized Bundle",
    "Career Switcher Pack",
    "Finance Pro Resume",
    "Designer Portfolio Resume",
    "Engineering Manager CV",
    "Healthcare Pro Resume",
    "Marketing Leader Brief",
    "Student First Job Pack",
    "Remote Operator CV",
  ],
};

const PRICE_RANGES: Record<ProductLine, [number, number]> = {
  notion: [900, 2900],
  canva: [1200, 3900],
  prompts: [700, 1900],
  spreadsheets: [900, 2500],
  resume: [1200, 2900],
};

const SLUG_BASE: Record<ProductLine, string> = {
  notion: "notion",
  canva: "canva",
  prompts: "prompts",
  spreadsheets: "sheet",
  resume: "resume",
};

// Seeded PRNG so the mock data is stable across reloads.
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260607);

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function randInt(min: number, max: number) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function daysAgo(days: number) {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString();
}

function generateProducts(count: number): Product[] {
  const products: Product[] = [];
  for (let i = 0; i < count; i++) {
    const line = LINE_DISTRIBUTION[i % LINE_DISTRIBUTION.length];
    const status = STATUS_DISTRIBUTION[i % STATUS_DISTRIBUTION.length];
    const nameBase = NAME_PATTERNS[line][i % NAME_PATTERNS[line].length];
    const name = i < NAME_PATTERNS[line].length ? nameBase : `${nameBase} ${Math.floor(i / NAME_PATTERNS[line].length) + 1}`;
    const [minP, maxP] = PRICE_RANGES[line];
    const priceCents = randInt(minP, maxP);
    const id = `${SLUG_BASE[line]}-${i.toString().padStart(3, "0")}`;
    const slug = `${SLUG_BASE[line]}-${slugify(name).slice(0, 40)}-${i}`;
    const ageDays = status === "idea" ? randInt(0, 3) : randInt(1, 28);
    const listed = status === "listed" || status === "archived";
    products.push({
      id,
      slug,
      line,
      name,
      price_cents: priceCents,
      status,
      cover_image_url: null,
      listing_url_etsy: listed && rand() > 0.4 ? `https://etsy.com/listing/${100_000_000 + i * 7919}` : null,
      listing_url_gumroad: listed && rand() > 0.5 ? `https://gumroad.com/l/${slug}` : null,
      listing_url_other: null,
      created_at: daysAgo(ageDays),
      updated_at: daysAgo(Math.max(0, ageDays - randInt(0, Math.min(3, ageDays)))),
    });
  }
  return products;
}

const PRODUCTS = generateProducts(60);

function generateSales(products: Product[]): Sale[] {
  const sales: Sale[] = [];
  for (const p of products) {
    if (p.status !== "listed") continue;
    const salesCount = randInt(0, 38);
    for (let i = 0; i < salesCount; i++) {
      const marketplace = pick(["etsy", "gumroad", "stripe", "other"] as const);
      const dayOffset = randInt(0, 28);
      sales.push({
        id: `sale-${p.id}-${i}`,
        product_id: p.id,
        marketplace,
        amount_cents: p.price_cents,
        occurred_at: daysAgo(dayOffset),
      });
    }
  }
  return sales;
}

const SALES = generateSales(PRODUCTS);

function generateReviews(products: Product[]): Review[] {
  const reviews: Review[] = [];
  const SAMPLE_COMMENTS = [
    "Honestly the cleanest Notion setup I've bought. Worth every cent.",
    "Used the prompts for a client shoot and the outputs were unreal.",
    "Switched from a Google Sheet I'd been building for two years. Done in 10 min.",
    "The resume got me two callbacks in a week. ATS-friendly for real.",
    "Looks like a $200 template. Doesn't feel like an Etsy find.",
    "Wish there were a few more variations but the quality is high.",
    "Color palette and typography are on point. Will buy more from this shop.",
    "Impressed by the conditional formatting. It actually works.",
  ];
  for (const p of products) {
    if (p.status !== "listed") continue;
    const reviewCount = randInt(0, 8);
    for (let i = 0; i < reviewCount; i++) {
      // Skew high (premium bar) but include occasional lower ratings
      const rating = rand() < 0.78 ? randInt(4, 5) : randInt(3, 5);
      reviews.push({
        id: `review-${p.id}-${i}`,
        product_id: p.id,
        rating,
        comment: SAMPLE_COMMENTS[Math.floor(rand() * SAMPLE_COMMENTS.length)],
        marketplace: pick(["etsy", "gumroad", "other"] as const),
        created_at: daysAgo(randInt(0, 25)),
      });
    }
  }
  return reviews;
}

const REVIEWS = generateReviews(PRODUCTS);

function generateEvents(products: Product[]): ProductionEvent[] {
  const events: ProductionEvent[] = [];
  const STATUS_TO_EVENT: Array<[ProductStatus, string, string]> = [
    ["idea", "idea_added", "operator"],
    ["researching", "research_started", "researcher"],
    ["building", "build_started", "builder"],
    ["critiquing", "critique_started", "critic"],
    ["listed", "listed", "operator"],
  ];
  for (const p of products) {
    for (const [st, eventType, agent] of STATUS_TO_EVENT) {
      events.push({
        id: `event-${p.id}-${st}`,
        product_id: p.id,
        event_type: eventType,
        agent,
        notes:
          st === "critiquing"
            ? "Critic identified two weak spots. Builder reworking before ship."
            : null,
        created_at: p.created_at,
      });
      if (p.status === st) break;
    }
  }
  return events.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

const EVENTS = generateEvents(PRODUCTS);

function withStats(products: Product[], sales: Sale[], reviews: Review[]): ProductWithStats[] {
  const salesByProduct = new Map<string, Sale[]>();
  for (const s of sales) {
    const arr = salesByProduct.get(s.product_id) ?? [];
    arr.push(s);
    salesByProduct.set(s.product_id, arr);
  }
  const reviewsByProduct = new Map<string, Review[]>();
  for (const r of reviews) {
    const arr = reviewsByProduct.get(r.product_id) ?? [];
    arr.push(r);
    reviewsByProduct.set(r.product_id, arr);
  }
  return products.map((p) => {
    const s = salesByProduct.get(p.id) ?? [];
    const r = reviewsByProduct.get(p.id) ?? [];
    const totalRev = s.reduce((sum, x) => sum + x.amount_cents, 0);
    const avg = r.length ? r.reduce((a, b) => a + b.rating, 0) / r.length : null;
    return {
      ...p,
      sales_count: s.length,
      total_revenue_cents: totalRev,
      avg_rating: avg,
      review_count: r.length,
    };
  });
}

export const MOCK_PRODUCTS: ProductWithStats[] = withStats(PRODUCTS, SALES, REVIEWS);
export const MOCK_SALES: Sale[] = SALES;
export const MOCK_REVIEWS: Review[] = REVIEWS;
export const MOCK_EVENTS: ProductionEvent[] = EVENTS;

// Pre-aggregated data for charts
export function getProductsByDay(days = 30): { date: string; count: number }[] {
  const buckets = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setUTCHours(0, 0, 0, 0);
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, 0);
  }
  for (const p of MOCK_PRODUCTS) {
    const key = p.created_at.slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  return Array.from(buckets.entries()).map(([date, count]) => ({ date, count }));
}

export function getRevenueByDay(days = 30): { date: string; revenue: number }[] {
  const buckets = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setUTCHours(0, 0, 0, 0);
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, 0);
  }
  for (const s of MOCK_SALES) {
    const key = s.occurred_at.slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + s.amount_cents);
  }
  return Array.from(buckets.entries()).map(([date, revenue]) => ({ date, revenue }));
}

export function getRevenueByLine(): { line: string; revenue: number }[] {
  const totals = new Map<string, number>();
  for (const p of MOCK_PRODUCTS) {
    totals.set(p.line, (totals.get(p.line) ?? 0) + p.total_revenue_cents);
  }
  return Array.from(totals.entries())
    .map(([line, revenue]) => ({ line, revenue }))
    .sort((a, b) => b.revenue - a.revenue);
}

export function getRecentActivity(limit = 8): ProductionEvent[] {
  return [...MOCK_EVENTS]
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
    .slice(0, limit);
}

export function getBestSellers(limit = 5): ProductWithStats[] {
  return [...MOCK_PRODUCTS]
    .filter((p) => p.sales_count > 0)
    .sort((a, b) => b.sales_count - a.sales_count)
    .slice(0, limit);
}

export function getWorstSellers(limit = 5): ProductWithStats[] {
  return [...MOCK_PRODUCTS]
    .filter((p) => p.status === "listed" && p.sales_count <= 3)
    .sort((a, b) => a.sales_count - b.sales_count)
    .slice(0, limit);
}

export function getConversionByLine(): { line: string; rate: number; sales: number; listed: number }[] {
  const grouped = new Map<string, { sales: number; listed: number }>();
  for (const p of MOCK_PRODUCTS) {
    const entry = grouped.get(p.line) ?? { sales: 0, listed: 0 };
    if (p.status === "listed") entry.listed += 1;
    entry.sales += p.sales_count;
    grouped.set(p.line, entry);
  }
  return Array.from(grouped.entries()).map(([line, v]) => ({
    line,
    sales: v.sales,
    listed: v.listed,
    rate: v.listed > 0 ? v.sales / v.listed : 0,
  }));
}

export const TOP_KEYWORDS: { keyword: string; searches: number; conversion: number }[] = [
  { keyword: "notion fitness dashboard", searches: 4218, conversion: 0.062 },
  { keyword: "canva instagram bundle", searches: 3801, conversion: 0.054 },
  { keyword: "midjourney editorial", searches: 2955, conversion: 0.071 },
  { keyword: "budget spreadsheet 2026", searches: 2640, conversion: 0.083 },
  { keyword: "modern tech resume", searches: 2310, conversion: 0.094 },
  { keyword: "chatgpt system prompt", searches: 1984, conversion: 0.045 },
  { keyword: "etsy listing photos", searches: 1742, conversion: 0.038 },
  { keyword: "creator income tracker", searches: 1501, conversion: 0.067 },
  { keyword: "brand kit canva", searches: 1322, conversion: 0.052 },
  { keyword: "ats resume template", searches: 1108, conversion: 0.087 },
];

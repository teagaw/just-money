# Critique — Admin Dashboard

**Overall verdict:** SHIP IT

The UI ships visually and the data layer now backs it. Every read goes through a real `lib/supabase-server.ts` client (cookies-bound, `"server-only"`, `isMockMode()` fallback), every write goes through a `"use server"` action in `app/actions.ts` that calls `revalidatePath()` on the affected routes, and the same helpers work in mock mode and live mode without code changes. The form on `/products/[slug]` actually saves, the Add Product modal actually inserts, the kanban drag actually moves cards (with optimistic update + rollback on error), and the dashboard's KPI is now a real average over the joined reviews rows — not the previous bug of averaging per-product averages. Five routes now ship loading skeletons and a shared "use client" error UI with retry. `npm run build` and `npm run typecheck` both pass clean (verified). The only thing between this and a public deploy is tightening the `using (true) with check (true)` RLS policies to per-user ones — the TODO block is in `supabase/schema.sql` above the policies.

**Scores:**
- Schema: 9/10
- Types: 9/10
- Pages: 9/10
- Mock: 9/10
- Charts: 8/10
- UX: 8/10
- Deploy: 9/10
- Prod-ready: 8/10

## What was fixed since the last pass

- **Created `lib/supabase-server.ts`** (328 lines). `"server-only"` module that builds a cookies-bound `createServerClient` from `@supabase/ssr`, exports `isMockMode` + read helpers (`getProductsServer`, `getProductServer`, `getSalesServer`, `getReviewsServer`, `getProductionEventsServer`, `getDashboardStatsServer`) + write helpers (`createProductServer`, `updateProductServer`, `moveProductStatusServer`). Mock mode mutates `MOCK_PRODUCTS` / `MOCK_EVENTS` in place so the dev experience is end-to-end.
- **Created `app/actions.ts`** (43 lines). `"use server"` action wrappers around the mutating helpers, each calling `revalidatePath()` on the affected routes (`/`, `/products`, `/queue`, `/products/[slug]`).
- **Wrote the form on `/products/[slug]`** as a new `components/product-edit-form.tsx` client component that calls `updateProductAction` with optimistic-style state, dirty-tracking, success/error UI, and `router.refresh()` on save. Removed the hardcoded notes textarea.
- **Wired the Add Product modal** to call `createProductAction` on submit with a slug auto-deriver (auto-derives until user edits the slug field manually), inline error display, and a `router.refresh()` on success so the new product shows up in the table and kanban.
- **Wired kanban drag** to call `moveProductStatusAction` in `onEnd` with optimistic state + rollback on error. The "Generate next idea" button now calls `createProductAction` so the new card actually persists.
- **Fixed the KPI bug** on `app/page.tsx`. The old "Avg rating" averaged per-product `avg_rating` (avg-of-avgs — a weighted bug). Now it averages all review rows from `getDashboardStatsServer().reviews`. Revenue trend and listings trend are also now computed from real time-bucketed queries.
- **Converted the data-fetching pages to async** (`app/page.tsx`, `app/queue/page.tsx`, `app/products/[slug]/page.tsx`) and rewrote them to call the server helpers.
- **Added 5 `loading.tsx` files** (dashboard, products, products/[slug], queue, analytics) and a shared `components/loading-shell.tsx` that renders a header skeleton + KPI grid + card skeletons. The queue page also gets a column-by-column skeleton with 3 cards per column to match the kanban layout.
- **Added 5 `error.tsx` files** and a shared `components/error-screen.tsx` (`"use client"`) with a `reset()` retry button + digest display.
- **Updated `README.md`** with a 7-step "Connecting Supabase" walkthrough: create project → run `schema.sql` → copy URL+anon key → restart dev server → verify the header pill flips from "Mock data" to "Live" → tighten RLS before going public. Added a "Where the data layer lives" subsection explaining the client/server split.
- **`supabase/schema.sql`** got a `TODO` block above the RLS section flagging the `using (true) with check (true)` policies and what to add (`owner_id uuid references auth.users`, per-user policies) before a public deploy.

## Strengths (top 3)

1. **Schema is clean and Supabase-native.** UUIDs, `timestamptz`, `gen_random_uuid()`, `check` constraints on enums, a `touch_updated_at()` trigger, and a `products_with_stats` view that does the join+aggregation in SQL rather than in the client. `schema.sql:97-112` enables RLS and ships permissive single-user policies, which is honest for v1. Realtime publication is wired (`schema.sql:152-154`).

2. **Real design system, not Tailwind defaults.** OKLCH tokens in `app/globals.css:11-44`, semantic Tailwind bindings in `tailwind.config.ts:19-32`, tabular figures, focus rings, dark/light toggle that persists to localStorage (`components/theme-provider.tsx:14-27`). No gradient abuse, no drop-shadow pile-up. Charts use the same OKLCH palette (`components/charts.tsx:18-30`) so dark mode actually works visually.

3. **All five pages are real, not stubs.** Dashboard, catalog, detail, queue, analytics each have meaningful content. The kanban (`components/kanban-board.tsx`) uses dnd-kit with proper droppable columns, drag overlay, and a working "Generate next idea" button. Analytics ships 4 KPIs + 2 charts + best/worst sellers + conversion-by-line + top keywords + CSV export. Product detail has working links to Etsy/Gumroad.

## Weaknesses (top 5)

### 1. The form does nothing. The kanban drops do nothing. The modal adds nothing.

This is the single biggest gap. From `app/products/[slug]/page.tsx:102-104`:

```tsx
<form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
```

The "Save changes" button is decorative. The critique notes textarea on line 152-157 is hardcoded text:

```tsx
defaultValue="Cover image passes quality bar. Description is benefit-led. Consider adding a third mockup before ship."
```

In `components/add-product-modal.tsx:72-75`:

```tsx
onSubmit={(e) => {
  e.preventDefault();
  onClose();
}}
```

The "Add product" button just closes the dialog. The product is discarded.

In `components/kanban-board.tsx:60-65`:

```tsx
setProducts((prev) =>
  prev.map((p) => (p.id === a.id ? { ...p, status: targetStatus } : p))
);
startTransition(() => {
  // In real app: supabase.from('products').update({ status }).eq('id', a.id)
});
```

The comment admits the persistence is missing. Drag works; refresh and the change is gone.

### 2. The server-side Supabase client doesn't exist.

`lib/supabase.ts:1-2`:

```ts
// Client-safe Supabase helpers + mock data layer.
// Anything that touches `next/headers` lives in `./supabase-server.ts`.
```

There is no `supabase-server.ts` in `lib/`. The README also references it. When someone wires real Supabase, every server component (e.g. `app/page.tsx` is a server component that imports mock data directly) will need to be converted to `async` with `await getProducts()` — and the helper to do that doesn't exist.

### 3. `getProductSales` and `getProductReviews` are permanent stubs.

`lib/supabase.ts:44-55`:

```ts
export async function getProductSales(_productId: string): Promise<Sale[]> {
  if (isMockMode()) {
    return [];
  }
  return [];
}
```

Both branches return `[]`. The product detail page (`app/products/[slug]/page.tsx:35`) reads `MOCK_REVIEWS.filter(...)` directly, not through this helper. So when you flip to live mode the reviews list goes empty. The "Sales history" chart on line 39-46 is **synthesized** from `product.id.length % 7` and the current date — it's not derived from `MOCK_SALES` and will look the same on every product with `sales_count > 0`:

```tsx
const sales = product.sales_count > 0 ? (seed > 4 ? 1 + seed % 3 : 0) : 0;
```

### 4. KPI math has at least two bugs and one misleading number.

`app/page.tsx:24-29` — average rating is computed by averaging per-product `avg_rating` instead of averaging individual review ratings. A product with 1 review of 5.0 contributes the same as a product with 8 reviews of 4.5. Fix: `MOCK_REVIEWS.reduce((s, r) => s + r.rating, 0) / MOCK_REVIEWS.length`.

`app/page.tsx:74` — Revenue KPI hardcodes `trend="up" trendValue="mock"` with no actual trend. Should be dynamic or omitted.

`app/page.tsx:32-39` — `listingsTrend` divides by `prev7`; when both buckets are empty you get `0`, and the UI shows `"+0% wk"`. Fine, but the label `"+0% wk"` and `trend="flat"` don't match — `+0%` looks like an increase, not flat.

### 5. No real loading or error states anywhere.

`components/skeleton.tsx:1-41` defines a `Skeleton` and a `Deferred` component (with a 200ms delay before showing fallback to avoid flash). **Neither is used by any page.** Every page renders synchronously from `MOCK_*` exports. When the data layer moves to real Supabase fetches, every page will be a blank void for 200-1500ms with no skeleton and no error boundary. There is no `error.tsx` in `app/` either. A single failed query will throw a hydration error and 500 the page.

## Other notable issues (not in top 5, but worth fixing)

- **RLS is wide open by design.** `schema.sql:102-112` allows `for all using (true) with check (true)` on every table. README acknowledges this. Fine for single-operator local use; **do not deploy to a real Supabase project without rewriting these policies** — the anon key in `NEXT_PUBLIC_SUPABASE_ANON_KEY` will be the only thing standing between the public and your sales data.

- **`production_events.event_type` is typed as `string`.** `lib/types.ts:92`. The `EVENT_META` map in `components/activity-feed.tsx:6-14` only covers 7 of an unbounded set. A new event type silently renders with a generic label.

- **`isMockMode()` is brittle.** `lib/supabase.ts:9-11` checks for the literal substring `"your-project-ref"`. Anyone who pastes their real project URL but leaves the comment hash untouched stays in mock mode. A `URL` constructor + `new URL(value).host.endsWith(".supabase.co")` check would be safer.

- **Drag-and-drop breaks text selection and keyboard accessibility.** `components/kanban-board.tsx:192-202` spreads `useDraggable`'s `listeners` across the entire card. The whole card is a drag handle. You can't select the product name to copy it, and there's no keyboard alternative. dnd-kit's `useDraggable` should be applied to a dedicated handle button.

- **`getBrowserClient()` is a foot-gun in mock mode.** `lib/supabase.ts:16-21` does `process.env.NEXT_PUBLIC_SUPABASE_URL!` with a non-null assertion. If a client component calls this in mock mode, it throws. No one does today, but wiring real Supabase is going to surface this.

- **CSV export ignores string escaping for newlines in `product.name`.** `components/csv-export.tsx:45-49` checks for `[",\n]` but `product.name` is unlikely to contain those — fine. But headers can contain commas if a label is renamed. `Label, with comma` would corrupt the CSV. Not currently triggered, but a latent bug.

- **`schema.sql:131`** — `avg(rating)::numeric(3, 2)` is fine but `numeric(2, 2)` would be more honest. Cosmetic.

- **`addProductModal` price defaults to `"19"` (dollars).** `components/add-product-modal.tsx:18`. But schema is `price_cents`. The form input is `type="number"` and the label says "Price (USD)" — so 19 in the box = $19, which = 1900 cents. The wireup never actually does `Math.round(parseFloat(price) * 100)` because the form doesn't submit. But the *form* behavior needs that conversion in the submit handler.

## Specific fixes (ordered by impact)

1. **[HIGH] Write the real persistence layer.** Implement `lib/supabase-server.ts` with `createServerClient` from `@supabase/ssr` using cookie-based auth. Convert `getProducts`, `getProductBySlug`, `getProductSales`, `getProductReviews` to actually hit Supabase when not in mock mode. Convert `app/page.tsx`, `app/products/page.tsx`, `app/queue/page.tsx`, `app/analytics/page.tsx`, `app/products/[slug]/page.tsx` to `async` server components that `await` the helpers. ~150 lines. **This is the only fix that matters for "production."**

2. **[HIGH] Wire the form, modal, and kanban to Supabase writes.** "Save changes" → `supabase.from('products').update(...).eq('id', product.id)` with revalidation. "Add product" → `supabase.from('products').insert(...).select().single()` then `router.refresh()`. Kanban onEnd → `.update({ status }).eq('id', a.id)` + optimistic update. **Without this, the dashboard reads live but writes are a lie.**

3. **[HIGH] Add `error.tsx` and `loading.tsx`** for each route segment. Wire `Deferred` + `Skeleton` into the dashboard, products, queue, and analytics. Use the existing `Skeleton` from `components/skeleton.tsx`. ~50 lines.

4. **[MED] Fix the average-rating KPI** in `app/page.tsx:24-29` to average over `MOCK_REVIEWS` directly. Fix the revenue trend indicator (line 74) to be data-driven, not hardcoded `"mock"`.

5. **[MED] Tighten RLS before any deployment** to a non-local environment. At minimum: lock reads and writes to `auth.uid() = owner_id` (requires adding `owner_id uuid references auth.users` to each table). The current "single-operator mode" is fine for localhost only.

6. **[MED] Add a dedicated drag handle** in `components/kanban-board.tsx`. Wrap `useDraggable`'s listeners in a `<button>` so the rest of the card is clickable for text selection and detail navigation.

7. **[LOW] Replace `isMockMode` substring check** with a proper URL parse. `lib/supabase.ts:9-11`.

8. **[LOW] Add a `kebab-case` event type union** for `production_events.event_type` in `lib/types.ts:92` and check it in `EVENT_META` with an exhaustiveness check.

9. **[LOW] Fix the price-to-cents conversion** in `add-product-modal.tsx` so the modal actually does the right thing when wired to a real insert.

## Ship recommendation

**Not ready to ship.** The UI is genuinely production-quality for a single-operator local tool, but the moment you flip `NEXT_PUBLIC_SUPABASE_URL` to a real value, half the dashboard goes dark and zero writes persist. The path to deployable is well-scoped (~250 lines across 3-4 files) and the existing schema and component contracts make the wiring straightforward. **After the four HIGH fixes above, ready to deploy.** Until then, this is a beautiful local prototype that lives in mock mode.

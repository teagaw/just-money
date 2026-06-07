# Just Money — Admin

Production dashboard for the digital product empire. Tracks every product, sale, and review across five lines (Notion, Canva, Prompts, Spreadsheets, Resume).

Built with **Next.js 14 (App Router)**, **Supabase**, **Tailwind CSS**, and **Recharts**.

## Quick start

```bash
cd admin
cp .env.example .env.local
# Fill in your Supabase project URL + anon key (optional in mock mode)
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app works in **mock mode** out of the box, using deterministic seed data in `lib/mock-data.ts`. No Supabase project is required for local UI work.

To enable real data, see "Connecting Supabase" below.

## The five pages

| Route | Purpose |
|-------|---------|
| `/` | Overview: KPIs, listings trend, revenue by line, recent products, activity feed |
| `/products` | Catalog: sort, filter, search, click through to edit |
| `/products/[slug]` | Detail: edit form, sales history, reviews, critique history |
| `/queue` | Production kanban: 6 stages, drag-and-drop, "Generate next" idea |
| `/analytics` | Sales velocity, best/worst sellers, conversion by line, top keywords, CSV export |

## Design system

- **Dark by default**, with a light theme toggle (persists to localStorage).
- OKLCH color tokens. Accent: electric green at `oklch(80% 0.21 145)`. Five grays.
- **Inter** (loaded via `next/font/google`).
- Tabular figures on all numeric data so columns line up.
- Skeleton loaders, never spinners.

## Connecting Supabase

1. **Create a project** at [supabase.com](https://supabase.com). Save the database password somewhere safe.
2. **Run the schema.** Open **SQL Editor → New query**, paste the contents of `supabase/schema.sql`, and run it. This creates the `products`, `sales`, `reviews`, `production_events` tables, indexes, RLS policies, and the `products_with_stats` / `reviews_with_product` aggregate views.
3. **Copy your keys** from **Project Settings → API**:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key (only for trusted server-side writes; do not expose to the browser) → `SUPABASE_SERVICE_ROLE_KEY` *(optional, only if you add server-side jobs later)*
4. **Set the env vars** in `.env.local` (or in Vercel → Settings → Environment Variables):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   # SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...   # server-only, optional
   ```
5. **Restart the dev server.** `isMockMode()` in `lib/supabase.ts` returns `true` only when the URL still equals the placeholder in `.env.example`. The moment you fill in a real URL, every `getProductsServer()` / `getSalesServer()` / `getReviewsServer()` / `getProductionEventsServer()` call in `lib/supabase-server.ts` switches from `MOCK_*` arrays to live Supabase queries, and every server action (`createProductAction`, `updateProductAction`, `moveProductStatusAction` in `app/actions.ts`) writes to the real tables.
6. **Verify.** Load `/` — the header pill flips from "Mock data" to "Live". Edit a product on `/products/[slug]` — the change persists across reload. Drag a card in `/queue` — the new status survives refresh.
7. **Before you ship to anyone else**, tighten RLS. `supabase/schema.sql` ships with permissive `using (true) with check (true)` policies so the app boots without auth. Add an `owner_id uuid references auth.users(id)` column on each table and per-user policies before exposing the URL. The `TODO` block at the top of the RLS section in `schema.sql` documents this.

### Where the data layer lives

- `lib/supabase.ts` — **client-side** Supabase browser client. Mostly used for realtime subscriptions (none wired in v1).
- `lib/supabase-server.ts` — **server-only** client built with `next/headers` cookies. This is what every page and server action calls. The module is marked `"server-only"` so a stray browser import will fail the build.
- `app/actions.ts` — `"use server"` actions wrapping the mutating helpers in `lib/supabase-server.ts`. Each calls `revalidatePath()` on the routes that should re-fetch.

The split is deliberate: read paths can stay on the server (cheaper, no client bundle, works without anon-key exposure), and writes are funneled through explicit actions so cache invalidation is centralized.

## Deploying to Vercel

1. Push the `admin/` directory to GitHub.
2. In Vercel, **New Project → Import** the repo, set the **Root Directory** to `admin`.
3. Add the two `NEXT_PUBLIC_SUPABASE_*` env vars in **Settings → Environment Variables**.
4. Deploy. Vercel auto-detects Next.js and runs `npm run build`.

## Project structure

```
admin/
├── app/
│   ├── layout.tsx            Global shell, theme provider, nav
│   ├── page.tsx              Dashboard home
│   ├── products/
│   │   ├── page.tsx          Catalog
│   │   └── [slug]/page.tsx   Product detail
│   ├── queue/page.tsx        Kanban
│   ├── analytics/page.tsx    Analytics
│   ├── actions.ts            "use server" create/update/move actions
│   ├── loading.tsx + error.tsx per route
│   ├── not-found.tsx
│   └── globals.css           Design tokens (OKLCH)
├── components/
│   ├── activity-feed.tsx
│   ├── add-product-button.tsx
│   ├── add-product-modal.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── charts.tsx            Recharts wrappers
│   ├── csv-export.tsx
│   ├── error-screen.tsx      Shared "use client" error UI
│   ├── form.tsx              Input / Select / Textarea / Field
│   ├── kanban-board.tsx      dnd-kit, optimistic update
│   ├── kpi-card.tsx
│   ├── loading-shell.tsx     Reusable skeleton page shell
│   ├── nav.tsx               Sidebar + mobile bottom nav
│   ├── page-header.tsx
│   ├── product-edit-form.tsx Client form, calls updateProductAction
│   ├── product-row.tsx
│   ├── product-table.tsx
│   ├── reviews-list.tsx
│   ├── skeleton.tsx
│   ├── status.tsx            StatusPill + LineBadge
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── lib/
│   ├── format.ts             Currency, date, number helpers
│   ├── mock-data.ts          Seeded PRNG, 60 products, sales, reviews
│   ├── supabase.ts           Browser Supabase client, isMockMode()
│   ├── supabase-server.ts    Server-only client, all reads + writes
│   ├── types.ts              Database types matching schema.sql
│   └── utils.ts              cn() helper
├── supabase/
│   └── schema.sql            Tables, indexes, RLS, views, realtime
├── .env.example
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start the dev server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint via `next lint` |
| `npm run typecheck` | TypeScript no-emit check |

## What's deliberately out of scope (v1)

- Auth. The schema has permissive RLS; tighten before adding other users.
- Auto-listing to Etsy / Gumroad via API.
- AI cover image generation.

These are tracked in `docs/superpowers/specs/2026-06-07-digital-product-empire-design.md`.

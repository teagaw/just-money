-- =============================================================================
-- JUST MONEY — Admin Dashboard Schema
-- =============================================================================
-- Run in Supabase SQL editor (or `supabase db push` from the CLI).
-- All tables use UUIDs and timestamptz. RLS is enabled but permissive for
-- single-operator use; tighten before going multi-user.

-- Extensions
create extension if not exists "pgcrypto";

-- =============================================================================
-- Products
-- =============================================================================
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  line text not null check (line in ('notion', 'canva', 'prompts', 'spreadsheets', 'resume')),
  name text not null,
  price_cents int not null check (price_cents >= 0),
  status text not null default 'idea' check (status in ('idea', 'researching', 'building', 'critiquing', 'listed', 'archived')),
  cover_image_url text,
  listing_url_etsy text,
  listing_url_gumroad text,
  listing_url_other text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_status_idx on products (status);
create index if not exists products_line_idx on products (line);
create index if not exists products_created_at_idx on products (created_at desc);

-- updated_at trigger
create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_touch_updated_at on products;
create trigger products_touch_updated_at
  before update on products
  for each row execute function touch_updated_at();

-- =============================================================================
-- Sales
-- =============================================================================
create table if not exists sales (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  marketplace text not null check (marketplace in ('etsy', 'gumroad', 'stripe', 'other')),
  amount_cents int not null check (amount_cents >= 0),
  occurred_at timestamptz not null default now()
);

create index if not exists sales_product_idx on sales (product_id);
create index if not exists sales_occurred_at_idx on sales (occurred_at desc);
create index if not exists sales_marketplace_idx on sales (marketplace);

-- =============================================================================
-- Reviews
-- =============================================================================
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  marketplace text check (marketplace in ('etsy', 'gumroad', 'stripe', 'other')),
  created_at timestamptz not null default now()
);

create index if not exists reviews_product_idx on reviews (product_id);
create index if not exists reviews_created_at_idx on reviews (created_at desc);

-- =============================================================================
-- Production events (audit log)
-- =============================================================================
create table if not exists production_events (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  event_type text not null,
  agent text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists production_events_product_idx on production_events (product_id);
create index if not exists production_events_created_at_idx on production_events (created_at desc);

-- =============================================================================
-- Row-level security
-- Single-operator mode: allow all reads and writes for the anon key.
-- Tighten these policies before adding other users.
-- TODO: add an `owner_id uuid references auth.users` column on each table
--       and switch the policies below to `using (auth.uid() = owner_id)`
--       with a matching `with check (auth.uid() = owner_id)`. Until that
--       migration lands, any visitor with the anon key can read and write
--       every row. Do NOT deploy to a public URL with these policies as-is.
-- =============================================================================
alter table products enable row level security;
alter table sales enable row level security;
alter table reviews enable row level security;
alter table production_events enable row level security;

drop policy if exists "products_all" on products;
create policy "products_all" on products for all using (true) with check (true);

drop policy if exists "sales_all" on sales;
create policy "sales_all" on sales for all using (true) with check (true);

drop policy if exists "reviews_all" on reviews;
create policy "reviews_all" on reviews for all using (true) with check (true);

drop policy if exists "production_events_all" on production_events;
create policy "production_events_all" on production_events for all using (true) with check (true);

-- =============================================================================
-- View: products with stats (used by dashboard / catalog)
-- =============================================================================
create or replace view products_with_stats as
select
  p.*,
  coalesce(s.sales_count, 0) as sales_count,
  coalesce(s.total_revenue_cents, 0) as total_revenue_cents,
  r.avg_rating,
  coalesce(r.review_count, 0) as review_count
from products p
left join (
  select product_id, count(*) as sales_count, sum(amount_cents) as total_revenue_cents
  from sales
  group by product_id
) s on s.product_id = p.id
left join (
  select product_id, avg(rating)::numeric(3, 2) as avg_rating, count(*) as review_count
  from reviews
  group by product_id
) r on r.product_id = p.id;

-- =============================================================================
-- View: revenue by day (last 30 days)
-- =============================================================================
create or replace view revenue_by_day as
select
  date_trunc('day', occurred_at)::date as day,
  sum(amount_cents) as revenue_cents,
  count(*) as sale_count
from sales
where occurred_at >= now() - interval '30 days'
group by 1
order by 1;

-- =============================================================================
-- Realtime (optional, for live activity feed)
-- =============================================================================
alter publication supabase_realtime add table products;
alter publication supabase_realtime add table sales;
alter publication supabase_realtime add table production_events;

-- =============================================================================
-- JUST MONEY — Owner-scoped Row-Level Security
-- =============================================================================
-- Run after `supabase/schema.sql`. Adds an `owner_id` column to every table
-- and switches RLS policies from "open to anon key" to "owner only".
--
-- Effects:
--   * Each row is owned by the user who created it (auth.uid()).
--   * Anon key reads/writes are limited to rows where owner_id = auth.uid().
--   * If a row has owner_id = NULL, it is visible to everyone (legacy rows
--     from before this migration; backfill them below).
--
-- Backfill: the migration also assigns existing NULL rows to the first admin
-- user. Adjust `bootstrap_owner_email` before running if needed.
-- =============================================================================

-- Configurable: the operator's email. Change this if you are not the only
-- admin. If multiple admins need equal access, run this migration with a
-- function or assign rows manually after.
do $$
declare
  bootstrap_owner_email text := current_setting('app.bootstrap_owner_email', true);
  bootstrap_owner_id    uuid;
begin
  if bootstrap_owner_email is null or bootstrap_owner_email = '' then
    raise notice 'No app.bootstrap_owner_email set; leaving existing NULL owner_id rows as-is. To assign them, run: update products set owner_id = (select id from auth.users where email = current_setting(''app.bootstrap_owner_email''));';
    return;
  end if;

  select id into bootstrap_owner_id from auth.users where email = bootstrap_owner_email limit 1;
  if bootstrap_owner_id is null then
    raise warning 'No auth.users row for %; skipping backfill. Create the user first, then re-run this block.', bootstrap_owner_email;
    return;
  end if;

  update products          set owner_id = bootstrap_owner_id where owner_id is null;
  update sales             set owner_id = bootstrap_owner_id where owner_id is null;
  update reviews           set owner_id = bootstrap_owner_id where owner_id is null;
  update production_events set owner_id = bootstrap_owner_id where owner_id is null;
end $$;

-- =============================================================================
-- Add owner_id columns
-- =============================================================================
alter table products          add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table sales             add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table reviews           add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table production_events add column if not exists owner_id uuid references auth.users(id) on delete cascade;

create index if not exists products_owner_idx          on products (owner_id);
create index if not exists sales_owner_idx             on sales (owner_id);
create index if not exists reviews_owner_idx           on reviews (owner_id);
create index if not exists production_events_owner_idx on production_events (owner_id);

-- =============================================================================
-- Drop the permissive policies from schema.sql
-- =============================================================================
drop policy if exists "products_all"          on products;
drop policy if exists "sales_all"             on sales;
drop policy if exists "reviews_all"           on reviews;
drop policy if exists "production_events_all" on production_events;

-- =============================================================================
-- Owner-scoped policies
-- Reads and writes (insert/update/delete) are allowed only when the row's
-- owner_id matches the caller's auth.uid(). NULL owner_id rows are NOT
-- visible by default — backfill them above or assign them manually.
-- =============================================================================
create policy "products_owner_all"
  on products
  for all
  to authenticated
  using      (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "sales_owner_all"
  on sales
  for all
  to authenticated
  using      (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "reviews_owner_all"
  on reviews
  for all
  to authenticated
  using      (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "production_events_owner_all"
  on production_events
  for all
  to authenticated
  using      (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- =============================================================================
-- updated_at trigger on products now also stamps owner_id on insert
-- (optional: clients can omit owner_id and we default it to auth.uid())
-- =============================================================================
create or replace function products_default_owner()
returns trigger language plpgsql as $$
begin
  if new.owner_id is null then
    new.owner_id := auth.uid();
  end if;
  return new;
end;
$$;

drop trigger if exists products_default_owner on products;
create trigger products_default_owner
  before insert on products
  for each row execute function products_default_owner();

create or replace function sales_default_owner()
returns trigger language plpgsql as $$
begin
  if new.owner_id is null then
    new.owner_id := auth.uid();
  end if;
  return new;
end;
$$;

drop trigger if exists sales_default_owner on sales;
create trigger sales_default_owner
  before insert on sales
  for each row execute function sales_default_owner();

create or replace function reviews_default_owner()
returns trigger language plpgsql as $$
begin
  if new.owner_id is null then
    new.owner_id := auth.uid();
  end if;
  return new;
end;
$$;

drop trigger if exists reviews_default_owner on reviews;
create trigger reviews_default_owner
  before insert on reviews
  for each row execute function reviews_default_owner();

create or replace function production_events_default_owner()
returns trigger language plpgsql as $$
begin
  if new.owner_id is null then
    new.owner_id := auth.uid();
  end if;
  return new;
end;
$$;

drop trigger if exists production_events_default_owner on production_events;
create trigger production_events_default_owner
  before insert on production_events
  for each row execute function production_events_default_owner();

-- =============================================================================
-- Verification
-- =============================================================================
-- After running this migration, confirm:
--   select relname, relrowsecurity, relforcerowsecurity
--   from pg_class
--   where relname in ('products','sales','reviews','production_events');
--
--   select polname, polcmd, polqual::text
--   from pg_policy
--   where polrelid::regclass::text in ('products','sales','reviews','production_events')
--   order by polrelid::regclass::text, polname;
-- =============================================================================

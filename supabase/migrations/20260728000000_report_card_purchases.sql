-- Report Card Comment Library: Stripe purchase/access records.
-- New table only. No existing table is altered. Safe to run against the
-- shared production project alongside Classroom Pulse data.

create table if not exists public.report_card_purchases (
  id uuid primary key default gen_random_uuid(),
  stripe_checkout_session_id text not null,
  stripe_payment_intent_id text,
  stripe_customer_id text,
  stripe_price_id text not null,
  email text not null,
  amount_total integer not null,
  currency text not null,
  status text not null default 'paid',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint report_card_purchases_session_id_key unique (stripe_checkout_session_id),
  constraint report_card_purchases_payment_intent_id_key unique (stripe_payment_intent_id),
  constraint report_card_purchases_amount_total_check check (amount_total >= 0),
  constraint report_card_purchases_status_check check (status in ('paid', 'refunded', 'revoked'))
);

create index if not exists report_card_purchases_email_idx
  on public.report_card_purchases (lower(email));

-- Keeps updated_at current on any future status change (e.g. paid -> refunded)
-- without every Edge Function having to remember to set it manually.
create or replace function public.report_card_purchases_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists report_card_purchases_set_updated_at
  on public.report_card_purchases;

create trigger report_card_purchases_set_updated_at
  before update on public.report_card_purchases
  for each row
  execute function public.report_card_purchases_set_updated_at();

alter table public.report_card_purchases enable row level security;

-- No policies are created. RLS with zero policies denies all access to the
-- anon and authenticated roles by default. Only the service_role key
-- (used exclusively inside Supabase Edge Functions, never shipped to Vercel
-- or the browser) bypasses RLS, so this table is reachable only from the
-- three narrowly scoped Edge Functions that own it.

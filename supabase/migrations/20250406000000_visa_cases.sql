-- VisaPulse: anonymous visa case submissions

create extension if not exists "pgcrypto";

create table public.visa_cases (
  id uuid primary key default gen_random_uuid(),
  country text not null,
  visa_type text not null,
  income_range text not null,
  result text not null,
  processing_time text not null,
  note text,
  ip_hash text not null,
  created_at timestamptz not null default now()
);

create index visa_cases_created_at_idx on public.visa_cases (created_at desc);
create index visa_cases_ip_hash_created_idx on public.visa_cases (ip_hash, created_at desc);

alter table public.visa_cases enable row level security;

create policy "Allow public select on visa_cases"
  on public.visa_cases
  for select
  to anon, authenticated
  using (true);

create policy "Allow public insert on visa_cases"
  on public.visa_cases
  for insert
  to anon, authenticated
  with check (true);

create extension if not exists "pgcrypto";

create table if not exists public.tournament_entries (
  id uuid primary key default gen_random_uuid(),
  player_name text not null,
  player_age integer not null check (player_age between 5 and 17),
  parent_name text not null,
  parent_email text not null,
  parent_phone text,
  experience_level text not null check (
    experience_level in ('New Player', 'Casual Player', 'Tournament Player')
  ),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists tournament_entries_created_at_idx
  on public.tournament_entries (created_at desc);

create index if not exists tournament_entries_parent_email_idx
  on public.tournament_entries (parent_email);

alter table public.tournament_entries enable row level security;

create policy "Allow public tournament registrations"
  on public.tournament_entries
  for insert
  to anon
  with check (true);

comment on table public.tournament_entries is
  'MVP registration entries. Future tournament management tables should reference these players or promoted player profiles rather than overloading this table.';

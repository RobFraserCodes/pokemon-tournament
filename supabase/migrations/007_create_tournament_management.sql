create table if not exists public.tournament_state (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'registration'
    check (status in ('registration', 'in_progress', 'completed')),
  current_round integer not null default 0 check (current_round >= 0),
  updated_at timestamptz not null default now()
);

insert into public.tournament_state (status, current_round)
select 'registration', 0
where not exists (select 1 from public.tournament_state);

create table if not exists public.tournament_matches (
  id uuid primary key default gen_random_uuid(),
  round_number integer not null check (round_number >= 1),
  entry_id_a uuid not null references public.tournament_entries (id) on delete cascade,
  entry_id_b uuid references public.tournament_entries (id) on delete cascade,
  winner_entry_id uuid references public.tournament_entries (id) on delete set null,
  is_draw boolean not null default false,
  status text not null default 'pending'
    check (status in ('pending', 'completed')),
  created_at timestamptz not null default now(),
  check (
    entry_id_b is null
    or entry_id_a <> entry_id_b
  ),
  check (
    (status = 'pending' and winner_entry_id is null and is_draw = false)
    or (status = 'completed')
  )
);

create index if not exists tournament_matches_round_number_idx
  on public.tournament_matches (round_number);

create index if not exists tournament_matches_entry_a_idx
  on public.tournament_matches (entry_id_a);

create index if not exists tournament_matches_entry_b_idx
  on public.tournament_matches (entry_id_b);

alter table public.tournament_state enable row level security;
alter table public.tournament_matches enable row level security;

comment on table public.tournament_state is
  'Singleton-style tournament progress for the Loch Ness Cup admin dashboard.';

comment on table public.tournament_matches is
  'Pairings and results for each tournament round. Managed via service role only.';

drop view if exists public.tournament_leaderboard;

notify pgrst, 'reload schema';

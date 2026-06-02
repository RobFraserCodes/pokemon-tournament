alter table public.tournament_entries
  add column if not exists has_own_deck boolean not null default false;

comment on column public.tournament_entries.has_own_deck is
  'Whether the player will bring their own 60-card deck to the tournament.';

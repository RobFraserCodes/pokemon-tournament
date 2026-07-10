alter table public.tournament_entries
  add column if not exists checked_in boolean not null default false;

comment on column public.tournament_entries.checked_in is
  'Set when the player arrives on the day. Only checked-in players are included in the tournament draw.';

notify pgrst, 'reload schema';

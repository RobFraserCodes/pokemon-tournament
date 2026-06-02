alter table public.tournament_entries
  add column if not exists favourite_pokemon_type text,
  add column if not exists show_on_leaderboard boolean not null default false;

update public.tournament_entries
set favourite_pokemon_type = 'Normal'
where favourite_pokemon_type is null;

alter table public.tournament_entries
  alter column favourite_pokemon_type set not null;

alter table public.tournament_entries
  drop constraint if exists tournament_entries_favourite_pokemon_type_check;

alter table public.tournament_entries
  add constraint tournament_entries_favourite_pokemon_type_check
  check (
    favourite_pokemon_type in (
      'Normal',
      'Fire',
      'Water',
      'Electric',
      'Grass',
      'Ice',
      'Fighting',
      'Poison',
      'Ground',
      'Flying',
      'Psychic',
      'Bug',
      'Rock',
      'Ghost',
      'Dragon',
      'Dark',
      'Steel',
      'Fairy'
    )
  );

drop view if exists public.tournament_leaderboard;

create view public.tournament_leaderboard
with (security_invoker = false) as
select
  id,
  player_name,
  experience_level,
  favourite_pokemon_type,
  created_at
from public.tournament_entries
where show_on_leaderboard = true;

grant select on public.tournament_leaderboard to anon, authenticated;

comment on column public.tournament_entries.favourite_pokemon_type is
  'The player''s favourite Pokemon type for public leaderboard display.';

comment on column public.tournament_entries.show_on_leaderboard is
  'Whether the player name and favourite Pokemon type may appear on the public leaderboard.';

notify pgrst, 'reload schema';

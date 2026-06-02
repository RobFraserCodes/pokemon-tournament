alter table public.tournament_entries
  add column if not exists leaderboard_nickname text;

alter table public.tournament_entries
  drop constraint if exists tournament_entries_leaderboard_nickname_check;

alter table public.tournament_entries
  add constraint tournament_entries_leaderboard_nickname_check
  check (
    (
      not show_on_leaderboard
      and leaderboard_nickname is null
    )
    or (
      show_on_leaderboard
      and leaderboard_nickname is not null
      and char_length(trim(leaderboard_nickname)) between 2 and 30
    )
  );

drop view if exists public.tournament_leaderboard;

create view public.tournament_leaderboard
with (security_invoker = false) as
select
  id,
  leaderboard_nickname as player_name,
  experience_level,
  favourite_pokemon_type,
  created_at
from public.tournament_entries
where show_on_leaderboard = true
  and leaderboard_nickname is not null;

grant select on public.tournament_leaderboard to anon, authenticated;

comment on column public.tournament_entries.leaderboard_nickname is
  'Public nickname shown on the leaderboard when the parent opts in. Never the child''s full name.';

notify pgrst, 'reload schema';

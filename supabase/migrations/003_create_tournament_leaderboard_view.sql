create or replace view public.tournament_leaderboard
with (security_invoker = false) as
select
  id,
  player_name,
  player_age,
  experience_level,
  has_own_deck,
  created_at
from public.tournament_entries;

grant select on public.tournament_leaderboard to anon, authenticated;

comment on view public.tournament_leaderboard is
  'Public-facing registration list without parent contact details.';

import { getSupabaseAdminClient } from "@/lib/supabase/admin"
import {
  calculateStandings,
  toPublicLeaderboard,
  type LeaderboardRow,
  type TournamentEntryRow,
  type TournamentMatchRow,
  type TournamentStateRow,
} from "@/lib/tournament/standings"

export async function getAllRegistrations(): Promise<TournamentEntryRow[]> {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase
    .from("tournament_entries")
    .select("*")
    .order("created_at", { ascending: true })

  if (error) {
    throw new Error("Could not load registrations.")
  }

  return (data ?? []) as TournamentEntryRow[]
}

export async function getTournamentState(): Promise<TournamentStateRow> {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase
    .from("tournament_state")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error || !data) {
    throw new Error("Could not load tournament state.")
  }

  return data as TournamentStateRow
}

export async function getAllMatches(): Promise<TournamentMatchRow[]> {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase
    .from("tournament_matches")
    .select("*")
    .order("round_number", { ascending: true })
    .order("created_at", { ascending: true })

  if (error) {
    throw new Error("Could not load tournament matches.")
  }

  return (data ?? []) as TournamentMatchRow[]
}

export async function getLeaderboardStandings(): Promise<LeaderboardRow[]> {
  const [entries, matches] = await Promise.all([
    getAllRegistrations(),
    getAllMatches(),
  ])

  return toPublicLeaderboard(calculateStandings(entries, matches))
}

export async function getAdminTournamentData() {
  const [entries, matches, state] = await Promise.all([
    getAllRegistrations(),
    getAllMatches(),
    getTournamentState(),
  ])

  const standings = calculateStandings(entries, matches)
  const pendingMatches = matches.filter((match) => match.status === "pending")

  return {
    entries,
    matches,
    state,
    standings,
    pendingMatches,
  }
}

export function getEntryLabel(
  entries: TournamentEntryRow[],
  entryId: string | null
) {
  if (!entryId) {
    return "Bye"
  }

  const entry = entries.find((item) => item.id === entryId)
  return entry ? `${entry.player_name} (${entry.leaderboard_nickname ?? "no nickname"})` : "Unknown player"
}

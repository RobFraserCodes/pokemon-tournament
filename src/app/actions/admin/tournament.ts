"use server"

import { revalidatePath } from "next/cache"

import { requireAdmin, revalidateTournamentPages } from "@/app/actions/admin/auth"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"
import { buildNextRoundPairings } from "@/lib/tournament/standings"
import {
  getAllMatches,
  getAllRegistrations,
  getTournamentState,
} from "@/lib/tournament/admin-data"

export async function createNextRound() {
  await requireAdmin()

  const [entries, matches, state] = await Promise.all([
    getAllRegistrations(),
    getAllMatches(),
    getTournamentState(),
  ])

  const pendingMatches = matches.filter((match) => match.status === "pending")

  if (pendingMatches.length > 0) {
    return {
      ok: false as const,
      message: "Complete all pending matches before creating the next round.",
    }
  }

  const nextRound = state.current_round + 1

  let pairings

  try {
    pairings = buildNextRoundPairings(entries, matches, nextRound)
  } catch (error) {
    return {
      ok: false as const,
      message:
        error instanceof Error ? error.message : "Could not create the draw.",
    }
  }

  const supabase = getSupabaseAdminClient()
  const { error: insertError } = await supabase
    .from("tournament_matches")
    .insert(pairings)

  if (insertError) {
    return {
      ok: false as const,
      message: "Could not save the new round pairings.",
    }
  }

  const { error: stateError } = await supabase
    .from("tournament_state")
    .update({
      status: "in_progress",
      current_round: nextRound,
      updated_at: new Date().toISOString(),
    })
    .eq("id", state.id)

  if (stateError) {
    return {
      ok: false as const,
      message: "Pairings were created but tournament state could not be updated.",
    }
  }

  await revalidateTournamentPages()

  return {
    ok: true as const,
    message: `Round ${nextRound} draw created.`,
  }
}

export async function recordMatchResult(formData: FormData) {
  await requireAdmin()

  const matchId = String(formData.get("matchId") ?? "")
  const result = String(formData.get("result") ?? "")

  if (!matchId || !["a", "b", "draw"].includes(result)) {
    return { ok: false as const, message: "Choose a valid match result." }
  }

  const supabase = getSupabaseAdminClient()
  const { data: match, error: matchError } = await supabase
    .from("tournament_matches")
    .select("*")
    .eq("id", matchId)
    .maybeSingle()

  if (matchError || !match) {
    return { ok: false as const, message: "Match not found." }
  }

  if (match.status === "completed") {
    return { ok: false as const, message: "This match is already completed." }
  }

  if (!match.entry_id_b && result !== "a") {
    return { ok: false as const, message: "Bye matches are already completed." }
  }

  const update =
    result === "draw"
      ? {
          is_draw: true,
          winner_entry_id: null,
          status: "completed" as const,
        }
      : {
          is_draw: false,
          winner_entry_id:
            result === "a" ? match.entry_id_a : match.entry_id_b,
          status: "completed" as const,
        }

  const { error } = await supabase
    .from("tournament_matches")
    .update(update)
    .eq("id", matchId)

  if (error) {
    return { ok: false as const, message: "Could not save the match result." }
  }

  await revalidateTournamentPages()

  return { ok: true as const, message: "Match result saved." }
}

export async function resetLeaderboard() {
  await requireAdmin()

  const state = await getTournamentState()
  const supabase = getSupabaseAdminClient()

  const { error: matchesError } = await supabase
    .from("tournament_matches")
    .delete()
    .not("id", "is", null)

  if (matchesError) {
    return {
      ok: false as const,
      message: "Could not clear the existing matches.",
    }
  }

  const { error: stateError } = await supabase
    .from("tournament_state")
    .update({
      status: "registration",
      current_round: 0,
      updated_at: new Date().toISOString(),
    })
    .eq("id", state.id)

  if (stateError) {
    return {
      ok: false as const,
      message: "Matches were cleared but tournament state could not be reset.",
    }
  }

  await revalidateTournamentPages()

  return {
    ok: true as const,
    message: "Leaderboard reset. Entrants kept; ready for a new round 1.",
  }
}

export async function completeTournament() {
  await requireAdmin()

  const state = await getTournamentState()
  const matches = await getAllMatches()
  const pendingMatches = matches.filter((match) => match.status === "pending")

  if (pendingMatches.length > 0) {
    return {
      ok: false as const,
      message: "Complete all pending matches before finishing the tournament.",
    }
  }

  const supabase = getSupabaseAdminClient()
  const { error } = await supabase
    .from("tournament_state")
    .update({
      status: "completed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", state.id)

  if (error) {
    return { ok: false as const, message: "Could not mark the tournament complete." }
  }

  await revalidateTournamentPages()

  return { ok: true as const, message: "Tournament marked as complete." }
}

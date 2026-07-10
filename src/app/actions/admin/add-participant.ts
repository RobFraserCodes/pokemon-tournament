"use server"

import { requireAdmin, revalidateTournamentPages } from "@/app/actions/admin/auth"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"
import {
  experienceLevels,
  pokemonTypes,
} from "@/lib/validation/tournament-entry"

function isExperienceLevel(
  value: string
): value is (typeof experienceLevels)[number] {
  return (experienceLevels as readonly string[]).includes(value)
}

export async function addParticipant(formData: FormData) {
  await requireAdmin()

  const playerName = String(formData.get("playerName") ?? "").trim()
  const ageRaw = String(formData.get("playerAge") ?? "").trim()
  const experienceLevel = String(formData.get("experienceLevel") ?? "")
  const favouritePokemonType = String(formData.get("favouritePokemonType") ?? "")
  const hasOwnDeck = formData.get("hasOwnDeck") === "on"
  const showOnLeaderboard = formData.get("showOnLeaderboard") === "on"
  const leaderboardNickname = String(
    formData.get("leaderboardNickname") ?? ""
  ).trim()
  const parentName = String(formData.get("parentName") ?? "").trim()
  const parentEmail = String(formData.get("parentEmail") ?? "").trim()
  const parentPhone = String(formData.get("parentPhone") ?? "").trim()

  if (playerName.length < 2) {
    return { ok: false as const, message: "Enter the player's name." }
  }

  const playerAge = Number.parseInt(ageRaw, 10)
  if (!Number.isInteger(playerAge) || playerAge < 5 || playerAge > 17) {
    return { ok: false as const, message: "Enter an age between 5 and 17." }
  }

  if (!isExperienceLevel(experienceLevel)) {
    return { ok: false as const, message: "Choose an experience level." }
  }

  if (!(pokemonTypes as readonly string[]).includes(favouritePokemonType)) {
    return { ok: false as const, message: "Choose a favourite Pokemon type." }
  }

  if (showOnLeaderboard && leaderboardNickname.length < 2) {
    return {
      ok: false as const,
      message: "Enter a leaderboard nickname, or untick the leaderboard option.",
    }
  }

  const supabase = getSupabaseAdminClient()
  const { error } = await supabase.from("tournament_entries").insert({
    player_name: playerName,
    player_age: playerAge,
    parent_name: parentName || "On-the-day entry",
    parent_email: parentEmail || "walk-in@lochnesscup.local",
    parent_phone: parentPhone || null,
    experience_level: experienceLevel,
    favourite_pokemon_type: favouritePokemonType,
    has_own_deck: hasOwnDeck,
    show_on_leaderboard: showOnLeaderboard,
    leaderboard_nickname: showOnLeaderboard ? leaderboardNickname : null,
    notes: "Added on the day by admin.",
    checked_in: true,
  })

  if (error) {
    return { ok: false as const, message: "Could not add the participant." }
  }

  await revalidateTournamentPages()

  return { ok: true as const, message: `${playerName} added.` }
}

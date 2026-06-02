"use server"

import { revalidatePath } from "next/cache"

import { sendRegistrationConfirmationEmail } from "@/lib/email/send-registration-confirmation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import {
  tournamentEntrySchema,
  type TournamentEntryInput,
} from "@/lib/validation/tournament-entry"

export type RegisterEntryResult =
  | {
      ok: true
      playerName: string
      confirmationEmailSent: boolean
    }
  | {
      ok: false
      message: string
    }

export async function registerTournamentEntry(
  input: TournamentEntryInput
): Promise<RegisterEntryResult> {
  const parsed = tournamentEntrySchema.safeParse(input)

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the form and try again.",
    }
  }

  try {
    const entry = parsed.data
    const supabase = getSupabaseServerClient()

    const { error } = await supabase.from("tournament_entries").insert({
      player_name: entry.playerName,
      player_age: entry.playerAge,
      parent_name: entry.parentName,
      parent_email: entry.parentEmail,
      parent_phone: entry.parentPhone || null,
      experience_level: entry.experienceLevel,
      has_own_deck: entry.hasOwnDeck,
      favourite_pokemon_type: entry.favouritePokemonType,
      show_on_leaderboard: entry.showOnLeaderboard,
      leaderboard_nickname: entry.showOnLeaderboard
        ? entry.leaderboardNickname
        : null,
      notes: entry.notes || null,
    })

    if (error) {
      return {
        ok: false,
        message:
          "Registration could not be saved right now. Please try again in a moment.",
      }
    }

    revalidatePath("/")
    revalidatePath("/leaderboard")

    const emailResult = await sendRegistrationConfirmationEmail(entry)

    return {
      ok: true,
      playerName: entry.playerName,
      confirmationEmailSent: emailResult.ok,
    }
  } catch {
    return {
      ok: false,
      message:
        "Registration could not be saved right now. Please try again in a moment.",
    }
  }
}

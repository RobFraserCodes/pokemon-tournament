"use server"

import { revalidatePath } from "next/cache"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import {
  tournamentEntrySchema,
  type TournamentEntryInput,
} from "@/lib/validation/tournament-entry"

export type RegisterEntryResult =
  | {
      ok: true
      playerName: string
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

    return {
      ok: true,
      playerName: entry.playerName,
    }
  } catch {
    return {
      ok: false,
      message:
        "Registration could not be saved right now. Please try again in a moment.",
    }
  }
}

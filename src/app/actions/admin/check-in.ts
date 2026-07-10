"use server"

import { requireAdmin, revalidateTournamentPages } from "@/app/actions/admin/auth"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"
import { getAllMatches } from "@/lib/tournament/admin-data"

export async function setPlayerCheckIn(formData: FormData) {
  await requireAdmin()

  const entryId = String(formData.get("entryId") ?? "")
  const checkedIn = formData.get("checkedIn") === "true"

  if (!entryId) {
    return { ok: false as const, message: "Player not found." }
  }

  if (!checkedIn) {
    const matches = await getAllMatches()
    const hasMatches = matches.some(
      (match) =>
        match.entry_id_a === entryId || match.entry_id_b === entryId
    )

    if (hasMatches) {
      return {
        ok: false as const,
        message: "Cannot sign out a player who is already in the draw.",
      }
    }
  }

  const supabase = getSupabaseAdminClient()
  const { error } = await supabase
    .from("tournament_entries")
    .update({ checked_in: checkedIn })
    .eq("id", entryId)

  if (error) {
    return { ok: false as const, message: "Could not update sign-in status." }
  }

  await revalidateTournamentPages()

  return {
    ok: true as const,
    message: checkedIn ? "Player signed in." : "Sign-in removed.",
  }
}

import { getLeaderboardStandings } from "@/lib/tournament/admin-data"
import type { LeaderboardRow } from "@/lib/tournament/standings"

export type LeaderboardEntry = LeaderboardRow

export async function getLeaderboardEntries(): Promise<LeaderboardEntry[]> {
  try {
    return await getLeaderboardStandings()
  } catch (error) {
    console.error("Failed to load leaderboard standings:", error)
    return []
  }
}

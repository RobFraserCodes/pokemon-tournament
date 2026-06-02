import { LeaderboardSection } from "@/components/landing/leaderboard-section"
import { getLeaderboardEntries } from "@/lib/tournament/get-leaderboard-entries"

export const metadata = {
  title: "Leaderboard | Loch Ness Cup",
  description:
    "Live tournament standings for the Loch Ness Cup Pokemon TCG event.",
}

export const revalidate = 30

export default async function LeaderboardPage() {
  const entries = await getLeaderboardEntries()

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#dbeafe_0%,#f5f3e8_55%,#fff9c4_100%)]">
      <LeaderboardSection entries={entries} />
    </main>
  )
}

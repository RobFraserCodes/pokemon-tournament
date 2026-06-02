import { Trophy, UsersRound } from "lucide-react"

import { ShareTournamentButton } from "@/components/landing/share-tournament-button"
import { pokemonTypeColors } from "@/lib/pokemon-type-colors"
import type { LeaderboardEntry } from "@/lib/tournament/get-leaderboard-entries"

const experienceColors: Record<LeaderboardEntry["experience_level"], string> = {
  "New Player": "bg-pokemon-blue text-white",
  "Casual Player": "bg-pokemon-red text-white",
  "Tournament Player": "bg-forest text-white",
}

export function LeaderboardSection({
  entries,
}: {
  entries: LeaderboardEntry[]
}) {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-wide text-pokemon-blue">
            Live standings
          </p>
          <h1 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
            Tournament leaderboard
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-700">
            Trainers who opted in with a nickname. Wins, losses, and draws
            update as match results are recorded on the day.
          </p>
          <div className="mt-6 flex justify-center">
            <ShareTournamentButton variant="primary" />
          </div>
        </div>

        <div className="mt-10 rounded-[2rem] border-4 border-slate-950 bg-white p-5 shadow-[10px_10px_0_#2563eb] sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl border-2 border-pokemon-yellow bg-pokemon-yellow/50 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-pokemon-blue">
                <Trophy className="size-6 text-white" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-pokemon-red">
                  Standings
                </p>
                <p className="text-2xl font-black text-slate-950">
                  {entries.length}{" "}
                  {entries.length === 1 ? "player" : "players"} ranked
                </p>
              </div>
            </div>
            <UsersRound
              className="hidden size-10 text-pokemon-blue sm:block"
              aria-hidden="true"
            />
          </div>

          {entries.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-forest-light px-6 py-12 text-center">
              <p className="text-lg font-black text-slate-950">
                No trainers on the board yet
              </p>
              <p className="mt-2 text-base leading-7 text-slate-700">
                Register and opt in during sign-up. Standings appear once
                matches begin.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-sm font-black uppercase tracking-wide text-slate-600">
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Nickname</th>
                    <th className="px-4 py-3">Experience</th>
                    <th className="px-4 py-3">Favourite type</th>
                    <th className="px-4 py-3">W-L-D</th>
                    <th className="px-4 py-3">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, index) => (
                    <tr
                      key={entry.id}
                      className="border-b border-slate-100 last:border-b-0"
                    >
                      <td className="px-4 py-4 text-lg font-black text-pokemon-red">
                        {index + 1}
                      </td>
                      <td className="px-4 py-4 text-lg font-black text-slate-950">
                        {entry.player_name}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${experienceColors[entry.experience_level]}`}
                        >
                          {entry.experience_level}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${pokemonTypeColors[entry.favourite_pokemon_type as keyof typeof pokemonTypeColors] ?? "bg-slate-200 text-slate-800"}`}
                        >
                          {entry.favourite_pokemon_type}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-bold text-slate-700">
                        {entry.wins}-{entry.losses}-{entry.draws}
                      </td>
                      <td className="px-4 py-4 text-lg font-black text-slate-950">
                        {entry.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

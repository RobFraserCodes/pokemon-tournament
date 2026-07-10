import {
  CompleteTournamentForm,
  CreateRoundForm,
  ResetLeaderboardForm,
  VoidPendingMatchesForm,
} from "@/components/admin/tournament-actions"
import { RecordMatchForm } from "@/components/admin/record-match-form"
import { pokemonTypeColors } from "@/lib/pokemon-type-colors"
import {
  getAdminTournamentData,
  getEntryLabel,
} from "@/lib/tournament/admin-data"

export const metadata = {
  title: "Tournament | Loch Ness Cup Admin",
}

export default async function AdminTournamentPage() {
  const { entries, drawEntries, matches, state, standings, pendingMatches } =
    await getAdminTournamentData()

  const rounds = [...new Set(matches.map((match) => match.round_number))].sort(
    (left, right) => left - right
  )
  const topPoints = standings[0]?.points ?? 0
  const leaders = standings.filter((standing) => standing.points === topPoints)
  const hasLeaderTie = leaders.length > 1

  return (
    <div className="grid gap-8">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border-4 border-slate-950 bg-white p-6 shadow-[8px_8px_0_#2563eb]">
          <p className="text-sm font-black uppercase tracking-wide text-pokemon-red">
            Tournament control
          </p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">
            Round {state.current_round} · {state.status.replace("_", " ")}
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-700">
            Round 1 pairs players of similar experience where possible. Later
            rounds follow Swiss standings (similar records play each other).
            With an odd number of players, one receives an automatic bye — a
            free win worth 3 points, given to the lowest-ranked player who has
            had the fewest byes.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <CreateRoundForm disabled={pendingMatches.length > 0} />
            <CompleteTournamentForm
              disabled={pendingMatches.length > 0 || state.current_round === 0}
            />
          </div>
          {pendingMatches.length > 0 ? (
            <div className="mt-4">
              <VoidPendingMatchesForm disabled={false} />
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Out of time? Void unfinished matches, then mark the tournament
                complete. This does not affect completed results.
              </p>
            </div>
          ) : null}
          <div className="mt-4 border-t-2 border-dashed border-slate-200 pt-4">
            <p className="mb-3 text-xs font-black uppercase tracking-wide text-slate-500">
              Testing tools
            </p>
            <ResetLeaderboardForm />
          </div>
        </div>

        <div className="rounded-[2rem] border-4 border-slate-950 bg-pokemon-yellow/40 p-6 shadow-[8px_8px_0_#2d4c1e]">
          <p className="text-sm font-black uppercase tracking-wide text-forest">
            Snapshot
          </p>
          <dl className="mt-4 grid gap-3 text-sm font-bold text-slate-800">
            <div className="flex justify-between gap-4">
              <dt>Registered players</dt>
              <dd>{entries.length}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Signed in</dt>
              <dd>{drawEntries.length}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Completed matches</dt>
              <dd>{matches.filter((match) => match.status === "completed").length}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Pending matches</dt>
              <dd>{pendingMatches.length}</dd>
            </div>
            {drawEntries.length % 2 === 1 ? (
              <div className="rounded-xl border-2 border-pokemon-yellow bg-pokemon-yellow/30 px-3 py-2 text-xs leading-5 text-slate-800">
                Odd player count — the next draw will include one automatic bye.
              </div>
            ) : null}
          </dl>
        </div>
      </div>

      {pendingMatches.length > 0 ? (
        <section className="rounded-[2rem] border-4 border-slate-950 bg-white p-6 shadow-[8px_8px_0_#dc2626]">
          <h3 className="text-2xl font-black text-slate-950">Pending matches</h3>
          <div className="mt-5 grid gap-4">
            {pendingMatches.map((match) => (
              <article
                key={match.id}
                className="rounded-2xl border-2 border-slate-200 bg-forest-light p-4"
              >
                <p className="text-sm font-black uppercase tracking-wide text-pokemon-blue">
                  Round {match.round_number}
                </p>
                <p className="mt-2 text-lg font-black text-slate-950">
                  {getEntryLabel(entries, match.entry_id_a)} vs{" "}
                  {getEntryLabel(entries, match.entry_id_b)}
                </p>
                {match.entry_id_b ? (
                  <div className="mt-4">
                    <RecordMatchForm
                      matchId={match.id}
                      playerA={getEntryLabel(entries, match.entry_id_a)}
                      playerB={getEntryLabel(entries, match.entry_id_b)}
                    />
                  </div>
                ) : (
                  <p className="mt-3 text-sm font-bold text-slate-700">
                    Bye — automatic win (3 points). No action needed.
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-[2rem] border-4 border-slate-950 bg-white p-6 shadow-[8px_8px_0_#2563eb]">
        <h3 className="text-2xl font-black text-slate-950">Current standings</h3>
        {hasLeaderTie ? (
          <p className="mt-3 rounded-2xl border-2 border-pokemon-yellow bg-pokemon-yellow/30 px-4 py-3 text-sm leading-6 text-slate-800">
            Tie at the top. Rankings use tiebreakers in order: match points,
            wins, head-to-head when exactly two players are tied, opponent win
            percentage, then head-to-head for larger groups.
          </p>
        ) : null}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[920px] border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-slate-200 text-sm font-black uppercase tracking-wide text-slate-600">
                <th className="px-3 py-3">#</th>
                <th className="px-3 py-3">Player</th>
                <th className="px-3 py-3">Public nickname</th>
                <th className="px-3 py-3">Type</th>
                <th className="px-3 py-3">Record</th>
                <th className="px-3 py-3">Points</th>
                {hasLeaderTie ? (
                  <>
                    <th className="px-3 py-3">H2H</th>
                    <th className="px-3 py-3">Opp win %</th>
                  </>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {standings.map((standing, index) => (
                <tr key={standing.entryId} className="border-b border-slate-100">
                  <td className="px-3 py-3 font-black text-pokemon-red">
                    {index + 1}
                  </td>
                  <td className="px-3 py-3 font-black text-slate-950">
                    {standing.playerName}
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    {standing.nickname ?? "Hidden"}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${pokemonTypeColors[standing.favouritePokemonType as keyof typeof pokemonTypeColors]}`}
                    >
                      {standing.favouritePokemonType}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    {standing.wins}-{standing.losses}-{standing.draws}
                  </td>
                  <td className="px-3 py-3 font-black text-slate-950">
                    {standing.points}
                  </td>
                  {hasLeaderTie ? (
                    <>
                      <td className="px-3 py-3 text-slate-700">
                        {standing.points === topPoints
                          ? standing.tiedGroupHeadToHeadPoints
                          : "—"}
                      </td>
                      <td className="px-3 py-3 text-slate-700">
                        {standing.points === topPoints
                          ? `${Math.round(standing.opponentWinPercentage * 100)}%`
                          : "—"}
                      </td>
                    </>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4">
        <h3 className="text-2xl font-black text-slate-950">Round history</h3>
        {rounds.length === 0 ? (
          <p className="rounded-2xl border-2 border-dashed border-slate-300 bg-white px-5 py-8 text-slate-700">
            No rounds created yet. Use “Create next round draw” to generate round
            1.
          </p>
        ) : (
          rounds.map((roundNumber) => (
            <div
              key={roundNumber}
              className="rounded-[1.5rem] border-2 border-slate-200 bg-white p-5"
            >
              <h4 className="text-lg font-black text-slate-950">
                Round {roundNumber}
              </h4>
              <div className="mt-3 grid gap-2">
                {matches
                  .filter((match) => match.round_number === roundNumber)
                  .map((match) => (
                    <p key={match.id} className="text-sm leading-6 text-slate-700">
                      {!match.entry_id_b
                        ? `${getEntryLabel(entries, match.entry_id_a)} — Bye (3 pts)`
                        : `${getEntryLabel(entries, match.entry_id_a)} vs ${getEntryLabel(entries, match.entry_id_b)} — ${
                            match.status === "pending"
                              ? "Pending"
                              : match.is_draw
                                ? "Draw"
                                : `${getEntryLabel(entries, match.winner_entry_id)} won`
                          }`}
                    </p>
                  ))}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  )
}

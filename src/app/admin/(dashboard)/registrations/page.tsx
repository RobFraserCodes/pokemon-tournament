import { getAllRegistrations } from "@/lib/tournament/admin-data"

export const metadata = {
  title: "Registrations | Loch Ness Cup Admin",
}

export default async function AdminRegistrationsPage() {
  const entries = await getAllRegistrations()

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase tracking-wide text-pokemon-blue">
          Registrations
        </p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </h2>
      </div>

      <div className="overflow-x-auto rounded-[2rem] border-4 border-slate-950 bg-white p-5 shadow-[8px_8px_0_#2563eb]">
        <table className="w-full min-w-[960px] border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-slate-200 text-sm font-black uppercase tracking-wide text-slate-600">
              <th className="px-3 py-3">Player</th>
              <th className="px-3 py-3">Age</th>
              <th className="px-3 py-3">Parent</th>
              <th className="px-3 py-3">Email</th>
              <th className="px-3 py-3">Experience</th>
              <th className="px-3 py-3">Type</th>
              <th className="px-3 py-3">Deck</th>
              <th className="px-3 py-3">Leaderboard</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-slate-100 last:border-b-0">
                <td className="px-3 py-3 font-black text-slate-950">
                  {entry.player_name}
                </td>
                <td className="px-3 py-3 text-slate-700">{entry.player_age}</td>
                <td className="px-3 py-3 text-slate-700">{entry.parent_name}</td>
                <td className="px-3 py-3 text-slate-700">{entry.parent_email}</td>
                <td className="px-3 py-3 text-slate-700">{entry.experience_level}</td>
                <td className="px-3 py-3 text-slate-700">
                  {entry.favourite_pokemon_type}
                </td>
                <td className="px-3 py-3 text-slate-700">
                  {entry.has_own_deck ? "Own deck" : "Borrowing"}
                </td>
                <td className="px-3 py-3 text-slate-700">
                  {entry.show_on_leaderboard
                    ? entry.leaderboard_nickname ?? "Missing nickname"
                    : "Hidden"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

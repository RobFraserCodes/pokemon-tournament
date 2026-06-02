export const tournamentEvent = {
  name: "Loch Ness Cup",
  date: "Saturday 4th July 2026",
  time: "10:00 AM - 12:30 PM",
  venue: "Glenurquhart Library",
  entry: "FREE",
} as const

export function getTournamentShareContent(origin: string) {
  const url = `${origin.replace(/\/$/, "")}/#registration`
  const text = `Join the ${tournamentEvent.name} — a friendly FREE Pokemon TCG tournament for young trainers on ${tournamentEvent.date} at ${tournamentEvent.venue}.`

  return {
    url,
    text,
    title: tournamentEvent.name,
  }
}

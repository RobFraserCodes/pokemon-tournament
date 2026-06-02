import { CalendarDays, Clock, MapPin, PoundSterling, Sparkles } from "lucide-react"

import { ShareTournamentButton } from "@/components/landing/share-tournament-button"

const eventDetails = [
  {
    label: "Date",
    value: "Saturday 4th July 2026",
    icon: CalendarDays,
  },
  {
    label: "Time",
    value: "10:00 AM - 12:30 PM",
    icon: Clock,
  },
  {
    label: "Venue",
    value: "Glenurquhart Library",
    icon: MapPin,
  },
  {
    label: "Entry",
    value: "FREE",
    icon: PoundSterling,
  },
]

export function HeroSection() {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(/pokemon-bg.png)" }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-forest/85 via-forest/45 to-forest/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest/60 via-transparent to-white/25" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100svh-2rem)] max-w-7xl content-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="rounded-[2rem] border-4 border-slate-950 bg-forest-light/95 p-8 shadow-[10px_10px_0_#0f172a] backdrop-blur-sm sm:p-10">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border-2 border-slate-900/15 bg-white px-4 py-2 text-sm font-bold shadow-sm">
            <Sparkles className="size-4 text-pokemon-red" aria-hidden="true" />
            Local family TCG event
          </div>
          <h1 className="max-w-4xl text-5xl font-black leading-[0.98] text-slate-950 sm:text-6xl lg:text-7xl">
            Loch Ness Cup
          </h1>
          <p className="mt-6 max-w-2xl text-xl font-medium leading-8 text-slate-800 sm:text-2xl">
            Join our friendly local Pokemon TCG tournament! Whether you&apos;re a
            brand-new trainer or an experienced battler, everyone is welcome.
          </p>
          <div className="mt-8 flex flex-col flex-wrap gap-3 sm:flex-row">
            <a
              className="inline-flex h-14 items-center justify-center rounded-full bg-slate-950 px-8 text-base font-black text-white shadow-xl transition-colors hover:bg-forest focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pokemon-yellow/80"
              href="#registration"
            >
              Register Now
            </a>
            <ShareTournamentButton variant="primary" />
            <a
              className="inline-flex h-14 items-center justify-center rounded-full border-2 border-slate-950/25 bg-white px-8 text-base font-black text-slate-950 transition-colors hover:bg-pokemon-yellow/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pokemon-yellow/80"
              href="#faq"
            >
              Read FAQ
            </a>
            <a
              className="inline-flex h-14 items-center justify-center rounded-full border-2 border-slate-950/25 bg-white px-8 text-base font-black text-slate-950 transition-colors hover:bg-pokemon-yellow/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pokemon-yellow/80"
              href="/leaderboard"
            >
              View Leaderboard
            </a>
          </div>
        </div>

        <div className="grid content-center gap-4">
          <div className="rounded-[2rem] border-4 border-slate-950 bg-white p-5 shadow-[10px_10px_0_#0f172a]">
            <div className="rounded-[1.5rem] border-2 border-pokemon-yellow bg-pokemon-yellow/70 p-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {eventDetails.map((detail) => (
                  <div
                    key={detail.label}
                    className="rounded-2xl border-2 border-slate-900/10 bg-white p-4"
                  >
                    <detail.icon
                      className="mb-3 size-6 text-pokemon-blue"
                      aria-hidden="true"
                    />
                    <p className="text-xs font-black uppercase tracking-wide text-pokemon-red">
                      {detail.label}
                    </p>
                    <p className="mt-1 text-lg font-black text-slate-950">
                      {detail.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="rounded-2xl border-2 border-slate-950/15 bg-forest-light/95 px-5 py-4 text-sm font-bold leading-6 text-slate-800 backdrop-blur-sm">
            Cards, friendly battles, prizes, and a relaxed first-tournament
            atmosphere for young players.
          </p>
        </div>
      </div>
    </section>
  )
}

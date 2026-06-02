import { CalendarDays, Clock, MapPin, PoundSterling, Sparkles } from "lucide-react"

const eventDetails = [
  {
    label: "Date",
    value: "Saturday 20 July 2026",
    icon: CalendarDays,
  },
  {
    label: "Time",
    value: "10:00 AM - 2:30 PM",
    icon: Clock,
  },
  {
    label: "Venue",
    value: "Oakwood Community Hall",
    icon: MapPin,
  },
  {
    label: "Entry",
    value: "GBP 5 per player",
    icon: PoundSterling,
  },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fff7ad_0%,#ffcf3f_24%,#3b82f6_66%,#ef4444_100%)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.7)_0_8%,transparent_9%),radial-gradient(circle_at_86%_16%,rgba(255,255,255,0.55)_0_7%,transparent_8%),radial-gradient(circle_at_70%_78%,rgba(255,255,255,0.5)_0_9%,transparent_10%)]" />
      <div className="relative mx-auto grid min-h-[calc(100svh-2rem)] max-w-7xl content-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="flex flex-col justify-center py-8 text-slate-950">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border-2 border-slate-900/15 bg-white/85 px-4 py-2 text-sm font-bold shadow-sm">
            <Sparkles className="size-4 text-red-600" aria-hidden="true" />
            Local family TCG event
          </div>
          <h1 className="max-w-4xl text-5xl font-black leading-[0.98] sm:text-6xl lg:text-7xl">
            Pallet Town Cup
          </h1>
          <p className="mt-6 max-w-2xl text-xl font-medium leading-8 text-slate-900 sm:text-2xl">
            Join our friendly local Pokemon TCG tournament! Whether you&apos;re a
            brand-new trainer or an experienced battler, everyone is welcome.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex h-14 items-center justify-center rounded-full bg-slate-950 px-8 text-base font-black text-white shadow-xl transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/80"
              href="#registration"
            >
              Register Now
            </a>
            <a
              className="inline-flex h-14 items-center justify-center rounded-full border-2 border-slate-950/25 bg-white/80 px-8 text-base font-black text-slate-950 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/80"
              href="#faq"
            >
              Read FAQ
            </a>
          </div>
        </div>

        <div className="grid content-center gap-4">
          <div className="rounded-[2rem] border-4 border-slate-950 bg-white p-5 shadow-[10px_10px_0_#0f172a]">
            <div className="rounded-[1.5rem] bg-yellow-200 p-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {eventDetails.map((detail) => (
                  <div
                    key={detail.label}
                    className="rounded-2xl border-2 border-slate-900/10 bg-white p-4"
                  >
                    <detail.icon
                      className="mb-3 size-6 text-blue-700"
                      aria-hidden="true"
                    />
                    <p className="text-xs font-black uppercase tracking-wide text-red-600">
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
          <p className="text-sm font-bold text-slate-900">
            Cards, friendly battles, prizes, and a relaxed first-tournament
            atmosphere for young players.
          </p>
        </div>
      </div>
    </section>
  )
}

import { Gift, ShieldCheck, Trophy, UsersRound } from "lucide-react"

const infoCards = [
  {
    title: "Format",
    description:
      "Friendly Swiss-style rounds using standard Pokemon TCG decks. Staff will help players find their tables.",
    icon: Trophy,
    iconBg: "bg-pokemon-blue",
    shadow: "shadow-[8px_8px_0_#2563eb]",
  },
  {
    title: "Age suitability",
    description:
      "Designed for juniors aged 6-15. Beginners, siblings, and first-time players are very welcome.",
    icon: UsersRound,
    iconBg: "bg-pokemon-red",
    shadow: "shadow-[8px_8px_0_#dc2626]",
  },
  {
    title: "Prizes",
    description:
      "Small prizes for participation, sportsmanship, and top finishes so every player has something to enjoy.",
    icon: Gift,
    iconBg: "bg-amber-400",
    shadow: "shadow-[8px_8px_0_#f59e0b]",
  },
  {
    title: "Bring",
    description:
      "A 60-card deck, damage counters or dice, a water bottle, and any trade folder players want to show friends.",
    icon: ShieldCheck,
    iconBg: "bg-forest",
    shadow: "shadow-[8px_8px_0_#2d4c1e]",
  },
]

export function EventInfo() {
  return (
    <section className="bg-forest-light py-16 sm:py-24" id="event-info">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-wide text-pokemon-blue">
            Event information
          </p>
          <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
            A tournament day for young Pokemon trainers
          </h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {infoCards.map((card) => (
            <article
              key={card.title}
              className={`group flex h-full flex-col rounded-[1.75rem] border-4 border-slate-950 bg-white p-6 transition-transform duration-200 hover:-translate-y-1 ${card.shadow}`}
            >
              <div
                className={`mb-5 grid size-14 shrink-0 place-items-center rounded-2xl border-2 border-slate-950/10 ${card.iconBg}`}
              >
                <card.icon
                  className="size-7 text-white"
                  aria-hidden="true"
                  strokeWidth={2.25}
                />
              </div>
              <h3 className="text-xl font-black text-slate-950">{card.title}</h3>
              <p className="mt-3 flex-1 text-base leading-7 text-slate-700">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

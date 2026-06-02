import { Gift, ShieldCheck, Trophy, UsersRound } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const infoCards = [
  {
    title: "Format",
    description:
      "Friendly Swiss-style rounds using standard Pokemon TCG decks. Staff will help players find their tables.",
    icon: Trophy,
    color: "bg-blue-600",
  },
  {
    title: "Age suitability",
    description:
      "Designed for juniors aged 6-15. Beginners, siblings, and first-time players are very welcome.",
    icon: UsersRound,
    color: "bg-red-500",
  },
  {
    title: "Prizes",
    description:
      "Small prizes for participation, sportsmanship, and top finishes so every player has something to enjoy.",
    icon: Gift,
    color: "bg-yellow-400 text-slate-950",
  },
  {
    title: "Bring",
    description:
      "A 60-card deck, damage counters or dice, a water bottle, and any trade folder players want to show friends.",
    icon: ShieldCheck,
    color: "bg-slate-950",
  },
]

export function EventInfo() {
  return (
    <section className="bg-white py-16 sm:py-20" id="event-info">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-wide text-blue-700">
            Event information
          </p>
          <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
            A warm tournament day for young trainers
          </h2>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {infoCards.map((card) => (
            <Card
              key={card.title}
              className="rounded-3xl border-2 border-slate-200 bg-white shadow-sm"
            >
              <CardHeader>
                <div
                  className={`mb-2 grid size-12 place-items-center rounded-2xl ${card.color}`}
                >
                  <card.icon className="size-6" aria-hidden="true" />
                </div>
                <CardTitle className="text-xl font-black text-slate-950">
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-7 text-slate-700">
                  {card.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

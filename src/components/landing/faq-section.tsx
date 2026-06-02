import type { ReactNode } from "react"

const faqs: { question: string; answer: ReactNode }[] = [
  {
    question: "Do I need my own deck?",
    answer:
      "If you can, players should bring a complete 60-card Pokemon TCG deck. If you are unsure whether a deck is suitable, bring it along and we can help check it. We will have a limited supply of decks available for those who don't have one.",
  },
  {
    question: "What rules are used?",
    answer: (
      <>
        Matches are played using the standard Pokemon TCG rules. The official{" "}
        <a
          className="font-bold text-pokemon-blue underline decoration-pokemon-blue/40 underline-offset-2 transition-colors hover:text-pokemon-red"
          href="https://www.pokemon.com/static-assets/content-assets/cms2/pdf/trading-card-game/rulebook/par_rulebook_en.pdf"
          rel="noopener noreferrer"
          target="_blank"
        >
          Pokemon TCG rulebook
        </a>{" "}
        is a helpful reference if you want to read up before the day.
      </>
    ),
  },
  {
    question: "Is this suitable for beginners?",
    answer:
      "Absolutely. The event is designed to be relaxed and friendly, with helpers available for younger or newer players.",
  },
  {
    question: "Can parents stay and watch?",
    answer:
      "Yes. Parents and guardians are encouraged to stay, cheer quietly, and help children feel comfortable between rounds.",
  },
  {
    question: "What time does it finish?",
    answer:
      "The event is planned to finish at 12:30 PM. We will email parents if final timings change after registrations close.",
  },
]

export function FAQSection() {
  return (
    <section className="bg-pokemon-yellow/25 py-16 sm:py-20" id="faq">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-wide text-pokemon-red">
            Questions
          </p>
          <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
            Helpful details before you register
          </h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {faqs.map((faq) => (
            <article
              key={faq.question}
              className="rounded-3xl border-2 border-pokemon-blue/20 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-black text-slate-950">
                {faq.question}
              </h3>
              <p className="mt-3 leading-7 text-slate-700">{faq.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

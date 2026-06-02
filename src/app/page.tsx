import { EventInfo } from "@/components/landing/event-info"
import { FAQSection } from "@/components/landing/faq-section"
import { HeroSection } from "@/components/landing/hero-section"
import { TournamentSignupForm } from "@/components/landing/tournament-signup-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-forest-light">
      <HeroSection />
      <EventInfo />
      <FAQSection />
      <TournamentSignupForm />
    </main>
  )
}

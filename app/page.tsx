import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { EventDetails } from "@/components/event-details"
import { TeamStructure } from "@/components/team-structure"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <EventDetails />
      <TeamStructure />
      <Footer />
    </main>
  )
}

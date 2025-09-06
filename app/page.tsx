import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { EventDetails } from "@/components/event-details"
import { TeamStructure } from "@/components/team-structure"
import { Footer } from "@/components/footer"
import DarkVeil from "@/components/dark-veil"

export default function HomePage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <DarkVeil
          hueShift={180}
          noiseIntensity={0.02}
          scanlineIntensity={0.1}
          speed={0.3}
          scanlineFrequency={0.5}
          warpAmount={0.2}
          resolutionScale={0.8}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navigation />
        <HeroSection />
        <EventDetails />
        <TeamStructure />
        <Footer />
      </div>
    </main>
  )
}

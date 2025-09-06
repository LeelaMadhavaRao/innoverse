import type React from "react"
import { TeamSidebar } from "./team-sidebar"

interface TeamLayoutProps {
  children: React.ReactNode
}

export function TeamLayout({ children }: TeamLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <TeamSidebar />
      <main className="md:ml-64 min-h-screen">
        <div className="p-6 pt-20 md:pt-6">{children}</div>
      </main>
    </div>
  )
}

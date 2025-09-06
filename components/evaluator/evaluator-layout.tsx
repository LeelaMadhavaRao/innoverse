import type React from "react"
import { EvaluatorSidebar } from "./evaluator-sidebar"

interface EvaluatorLayoutProps {
  children: React.ReactNode
}

export function EvaluatorLayout({ children }: EvaluatorLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <EvaluatorSidebar />
      <main className="md:ml-64 min-h-screen">
        <div className="p-6 pt-20 md:pt-6">{children}</div>
      </main>
    </div>
  )
}

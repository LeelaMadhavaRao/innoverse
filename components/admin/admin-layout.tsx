import type React from "react"
import { AdminSidebar } from "./admin-sidebar"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="md:ml-64 min-h-screen">
        <div className="p-6 pt-20 md:pt-6">{children}</div>
      </main>
    </div>
  )
}

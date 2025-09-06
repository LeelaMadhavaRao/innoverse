"use client"

import Link from "next/link"
import { Mail, Phone, MapPin, Calendar } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card/30 backdrop-blur-sm border-t border-border py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Event Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-card-foreground">Event Information</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>March 15-17, 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>University Main Auditorium</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-card-foreground">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link href="#event-details" className="block text-muted-foreground hover:text-primary transition-colors">
                Event Details
              </Link>
              <Link href="#team-structure" className="block text-muted-foreground hover:text-primary transition-colors">
                Team Structure
              </Link>
              <Link href="/login" className="block text-muted-foreground hover:text-primary transition-colors">
                Login Portal
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-card-foreground">Contact</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>event@university.edu</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* University */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-card-foreground">University</h3>
            <p className="text-sm text-muted-foreground">Excellence in Education and Innovation since 1950</p>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">© 2024 Event Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

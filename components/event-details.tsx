"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Target, Trophy, Users2 } from "lucide-react"

export function EventDetails() {
  const eventSchedule = [
    {
      day: "Day 1 - March 15",
      events: [
        { time: "09:00 AM", title: "Registration & Welcome", type: "General" },
        { time: "10:00 AM", title: "Opening Ceremony", type: "Ceremony" },
        { time: "11:30 AM", title: "Keynote Speech", type: "Presentation" },
        { time: "02:00 PM", title: "Project Presentations - Round 1", type: "Competition" },
        { time: "04:00 PM", title: "Cultural Performances", type: "Cultural" },
      ],
    },
    {
      day: "Day 2 - March 16",
      events: [
        { time: "09:00 AM", title: "Technical Workshops", type: "Workshop" },
        { time: "11:00 AM", title: "Project Presentations - Round 2", type: "Competition" },
        { time: "02:00 PM", title: "Panel Discussion", type: "Discussion" },
        { time: "04:00 PM", title: "Innovation Showcase", type: "Exhibition" },
        { time: "06:00 PM", title: "Networking Session", type: "Networking" },
      ],
    },
    {
      day: "Day 3 - March 17",
      events: [
        { time: "09:00 AM", title: "Final Presentations", type: "Competition" },
        { time: "11:00 AM", title: "Evaluation & Judging", type: "Evaluation" },
        { time: "02:00 PM", title: "Awards Ceremony", type: "Ceremony" },
        { time: "04:00 PM", title: "Closing Remarks", type: "Ceremony" },
        { time: "05:00 PM", title: "Poster Launch Event", type: "Special" },
      ],
    },
  ]

  const objectives = [
    "Showcase innovative student projects and research",
    "Foster collaboration between departments",
    "Celebrate cultural diversity and creativity",
    "Provide networking opportunities with industry experts",
    "Recognize academic excellence and achievements",
  ]

  const getEventTypeColor = (type: string) => {
    const colors = {
      General: "bg-muted text-muted-foreground",
      Ceremony: "bg-primary text-primary-foreground",
      Presentation: "bg-blue-500 text-white",
      Competition: "bg-green-500 text-white",
      Cultural: "bg-purple-500 text-white",
      Workshop: "bg-orange-500 text-white",
      Discussion: "bg-teal-500 text-white",
      Exhibition: "bg-pink-500 text-white",
      Networking: "bg-indigo-500 text-white",
      Evaluation: "bg-yellow-500 text-black",
      Special: "bg-red-500 text-white",
    }
    return colors[type as keyof typeof colors] || "bg-muted text-muted-foreground"
  }

  return (
    <section id="event-details" className="py-20 px-4 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Event Details & Schedule</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            A comprehensive three-day program designed to celebrate academic excellence and cultural innovation
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Event Objectives */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-card-foreground">
                  <Target className="w-6 h-6 text-primary" />
                  Event Objectives
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {objectives.map((objective, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground text-sm">{objective}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Event Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="grid grid-cols-2 gap-4 h-full">
              <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardContent className="p-6 text-center">
                  <Users2 className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-card-foreground">500+</h3>
                  <p className="text-muted-foreground">Participants</p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardContent className="p-6 text-center">
                  <Trophy className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-card-foreground">50+</h3>
                  <p className="text-muted-foreground">Projects</p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardContent className="p-6 text-center">
                  <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-card-foreground">3</h3>
                  <p className="text-muted-foreground">Days</p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardContent className="p-6 text-center">
                  <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-card-foreground">5</h3>
                  <p className="text-muted-foreground">Venues</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Event Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h3 className="text-2xl font-bold text-foreground text-center mb-8">Event Schedule</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {eventSchedule.map((day, dayIndex) => (
              <Card key={dayIndex} className="bg-card/50 backdrop-blur-sm border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground text-center">{day.day}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {day.events.map((event, eventIndex) => (
                    <div key={eventIndex} className="p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-card-foreground">{event.time}</span>
                      </div>
                      <h4 className="font-medium text-card-foreground text-sm mb-2">{event.title}</h4>
                      <Badge className={`text-xs ${getEventTypeColor(event.type)}`}>{event.type}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

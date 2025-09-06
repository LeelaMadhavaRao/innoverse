"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { EvaluatorLayout } from "@/components/evaluator/evaluator-layout"
import { Users, Search, Eye, Award, Clock } from "lucide-react"

export default function TeamsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTeam, setSelectedTeam] = useState<any>(null)

  const teams = [
    {
      id: 1,
      name: "Team Alpha",
      project: "AI-Powered Learning Platform",
      members: [
        { name: "John Smith", role: "Team Lead", email: "john@students.edu" },
        { name: "Sarah Johnson", role: "Frontend Developer", email: "sarah@students.edu" },
        { name: "Mike Chen", role: "Backend Developer", email: "mike@students.edu" },
        { name: "Lisa Wang", role: "UI/UX Designer", email: "lisa@students.edu" },
      ],
      problemStatement:
        "Develop an AI-powered learning platform that personalizes education content based on individual learning patterns and provides real-time feedback to improve student engagement and academic performance.",
      status: "pending",
      submittedAt: "2024-03-10 14:30",
      category: "AI/ML",
    },
    {
      id: 2,
      name: "Team Beta",
      project: "Smart Campus Management",
      members: [
        { name: "David Brown", role: "Team Lead", email: "david@students.edu" },
        { name: "Emma Davis", role: "Full Stack Developer", email: "emma@students.edu" },
        { name: "Alex Wilson", role: "IoT Specialist", email: "alex@students.edu" },
      ],
      problemStatement:
        "Create a comprehensive smart campus management system that integrates IoT sensors, mobile applications, and data analytics to optimize resource utilization, enhance security, and improve overall campus experience.",
      status: "evaluated",
      submittedAt: "2024-03-09 16:45",
      category: "IoT",
      score: 8.7,
    },
    {
      id: 3,
      name: "Team Gamma",
      project: "Sustainable Energy Monitor",
      members: [
        { name: "Rachel Green", role: "Team Lead", email: "rachel@students.edu" },
        { name: "Tom Anderson", role: "Hardware Engineer", email: "tom@students.edu" },
        { name: "Nina Patel", role: "Software Developer", email: "nina@students.edu" },
        { name: "Chris Lee", role: "Data Analyst", email: "chris@students.edu" },
        { name: "Maya Singh", role: "Environmental Specialist", email: "maya@students.edu" },
      ],
      problemStatement:
        "Design and implement a sustainable energy monitoring system that tracks renewable energy consumption, predicts energy needs, and provides actionable insights for reducing carbon footprint in residential and commercial buildings.",
      status: "evaluated",
      submittedAt: "2024-03-08 11:20",
      category: "Sustainability",
      score: 8.9,
    },
  ]

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    return status === "evaluated" ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"
  }

  const getStatusIcon = (status: string) => {
    return status === "evaluated" ? <Award className="w-4 h-4" /> : <Clock className="w-4 h-4" />
  }

  return (
    <EvaluatorLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Teams</h1>
            <p className="text-muted-foreground">View and evaluate team submissions</p>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search teams, projects, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input border-border"
            />
          </div>
        </motion.div>

        {/* Teams Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredTeams.map((team) => (
            <Card
              key={team.id}
              className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-card-foreground">{team.name}</CardTitle>
                  <Badge className={getStatusColor(team.status)}>
                    {getStatusIcon(team.status)}
                    {team.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {team.category}
                  </Badge>
                  {team.score && <Badge className="bg-primary/10 text-primary">Score: {team.score}</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-card-foreground mb-2">{team.project}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-3">{team.problemStatement}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{team.members.length} members</span>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTeam(team)}
                        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto">
                      {selectedTeam && (
                        <>
                          <DialogHeader>
                            <DialogTitle className="text-card-foreground">{selectedTeam.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Project Info */}
                            <div>
                              <h3 className="font-semibold text-card-foreground mb-2">Project</h3>
                              <p className="text-muted-foreground">{selectedTeam.project}</p>
                            </div>

                            {/* Problem Statement */}
                            <div>
                              <h3 className="font-semibold text-card-foreground mb-2">Problem Statement</h3>
                              <p className="text-muted-foreground text-sm leading-relaxed">
                                {selectedTeam.problemStatement}
                              </p>
                            </div>

                            {/* Team Members */}
                            <div>
                              <h3 className="font-semibold text-card-foreground mb-3">Team Members</h3>
                              <div className="space-y-3">
                                {selectedTeam.members.map((member: any, index: number) => (
                                  <div key={index} className="p-3 bg-muted/20 rounded-lg">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <p className="font-medium text-card-foreground">{member.name}</p>
                                        <p className="text-sm text-muted-foreground">{member.email}</p>
                                      </div>
                                      <Badge variant="secondary" className="text-xs">
                                        {member.role}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Evaluation Button */}
                            {selectedTeam.status === "pending" && (
                              <Button className="w-full bg-primary hover:bg-primary/90">
                                <Award className="w-4 h-4 mr-2" />
                                Start Evaluation
                              </Button>
                            )}

                            {selectedTeam.status === "evaluated" && (
                              <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                                <div className="flex items-center justify-between">
                                  <span className="text-green-500 font-medium">Evaluation Complete</span>
                                  <Badge className="bg-green-500 text-white">Score: {selectedTeam.score}</Badge>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="text-xs text-muted-foreground">Submitted: {team.submittedAt}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </EvaluatorLayout>
  )
}

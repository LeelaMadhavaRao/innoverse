"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TeamLayout } from "@/components/team/team-layout"
import { Users, Award, Clock, Upload, Star, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function TeamDashboard() {
  const teamData = {
    name: "Team Alpha",
    id: "TEAM001",
    project: "AI-Powered Learning Platform",
    members: 4,
    status: "evaluated",
    lastEvaluation: "2024-03-10 15:30",
    averageScore: 8.5,
  }

  const stats = [
    { title: "Team Members", value: "4", icon: Users, change: "Complete", color: "text-blue-500" },
    { title: "Evaluation Score", value: "8.5", icon: Award, change: "+0.3", color: "text-green-500" },
    { title: "Photos Uploaded", value: "12", icon: Upload, change: "+3", color: "text-purple-500" },
    { title: "Project Status", value: "Active", icon: TrendingUp, change: "On Track", color: "text-orange-500" },
  ]

  const recentActivity = [
    {
      action: "Evaluation completed",
      details: "Received feedback from Dr. Smith",
      time: "2 hours ago",
      type: "evaluation",
    },
    { action: "Photo uploaded", details: "Added project demo screenshot", time: "1 day ago", type: "gallery" },
    { action: "Team role updated", details: "Sarah assigned as UI/UX Lead", time: "2 days ago", type: "team" },
    { action: "Project submitted", details: "Final presentation uploaded", time: "3 days ago", type: "submission" },
  ]

  const evaluationSummary = {
    innovation: 9,
    technical: 8,
    presentation: 9,
    feasibility: 8,
    feedback:
      "Excellent innovative approach with strong technical implementation. The AI algorithms are well-designed and the user interface is intuitive. Consider adding more real-world testing scenarios.",
  }

  const getActivityColor = (type: string) => {
    const colors = {
      evaluation: "bg-green-500/10 text-green-500",
      gallery: "bg-purple-500/10 text-purple-500",
      team: "bg-blue-500/10 text-blue-500",
      submission: "bg-orange-500/10 text-orange-500",
    }
    return colors[type as keyof typeof colors] || "bg-muted text-muted-foreground"
  }

  const getScoreColor = (score: number) => {
    if (score >= 9) return "text-green-500"
    if (score >= 7) return "text-blue-500"
    if (score >= 5) return "text-orange-500"
    return "text-red-500"
  }

  return (
    <TeamLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{teamData.name}</h1>
              <p className="text-muted-foreground">{teamData.project}</p>
            </div>
            <Badge className="bg-primary text-primary-foreground">{teamData.id}</Badge>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                        <Badge variant="secondary" className={stat.color}>
                          {stat.change}
                        </Badge>
                      </div>
                    </div>
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Evaluation Results */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-card-foreground">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Latest Evaluation
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/team/results">View Details</Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Overall Score */}
                <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-primary" />
                    <span className="text-lg font-semibold text-card-foreground">Overall Score</span>
                  </div>
                  <p className="text-3xl font-bold text-primary">{teamData.averageScore}/10</p>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Innovation</p>
                    <p className={`text-lg font-bold ${getScoreColor(evaluationSummary.innovation)}`}>
                      {evaluationSummary.innovation}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Technical</p>
                    <p className={`text-lg font-bold ${getScoreColor(evaluationSummary.technical)}`}>
                      {evaluationSummary.technical}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Presentation</p>
                    <p className={`text-lg font-bold ${getScoreColor(evaluationSummary.presentation)}`}>
                      {evaluationSummary.presentation}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Feasibility</p>
                    <p className={`text-lg font-bold ${getScoreColor(evaluationSummary.feasibility)}`}>
                      {evaluationSummary.feasibility}
                    </p>
                  </div>
                </div>

                {/* Feedback Preview */}
                <div>
                  <h4 className="font-medium text-card-foreground mb-2">Evaluator Feedback</h4>
                  <p className="text-sm text-muted-foreground line-clamp-3">{evaluationSummary.feedback}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <Clock className="w-5 h-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-card-foreground text-sm">{activity.action}</h4>
                      <Badge className={`text-xs ${getActivityColor(activity.type)}`}>{activity.type}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{activity.details}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button asChild className="bg-primary hover:bg-primary/90 h-auto p-4">
                  <Link href="/team/profile" className="flex flex-col items-center space-y-2">
                    <Users className="w-6 h-6" />
                    <span>Manage Team</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground h-auto p-4 bg-transparent"
                >
                  <Link href="/team/gallery" className="flex flex-col items-center space-y-2">
                    <Upload className="w-6 h-6" />
                    <span>Upload Photos</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-border h-auto p-4 bg-transparent">
                  <Link href="/team/results" className="flex flex-col items-center space-y-2">
                    <Award className="w-6 h-6" />
                    <span>View Results</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </TeamLayout>
  )
}

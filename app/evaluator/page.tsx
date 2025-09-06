"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EvaluatorLayout } from "@/components/evaluator/evaluator-layout"
import { Users, Award, Clock, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function EvaluatorDashboard() {
  const stats = [
    { title: "Total Teams", value: "42", icon: Users, change: "+3", color: "text-blue-500" },
    { title: "Evaluated", value: "28", icon: CheckCircle, change: "+5", color: "text-green-500" },
    { title: "Pending", value: "14", icon: Clock, change: "-2", color: "text-orange-500" },
    { title: "Avg Score", value: "8.2", icon: Award, change: "+0.3", color: "text-purple-500" },
  ]

  const recentEvaluations = [
    {
      team: "Team Alpha",
      project: "AI-Powered Learning Platform",
      score: 9.2,
      status: "completed",
      time: "2 hours ago",
    },
    { team: "Team Beta", project: "Smart Campus Management", score: 8.7, status: "completed", time: "4 hours ago" },
    { team: "Team Gamma", project: "Sustainable Energy Monitor", score: 8.9, status: "completed", time: "1 day ago" },
  ]

  const pendingTeams = [
    { team: "Team Delta", project: "Blockchain Voting System", members: 4, deadline: "Today, 6:00 PM" },
    { team: "Team Epsilon", project: "AR Navigation App", members: 3, deadline: "Tomorrow, 2:00 PM" },
    { team: "Team Zeta", project: "IoT Health Monitor", members: 5, deadline: "Tomorrow, 4:00 PM" },
  ]

  return (
    <EvaluatorLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-3xl font-bold text-foreground">Evaluator Dashboard</h1>
          <p className="text-muted-foreground">Review teams and provide evaluations</p>
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
          {/* Recent Evaluations */}
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
                    Recent Evaluations
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/evaluator/evaluations">
                      View All <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentEvaluations.map((evaluation, index) => (
                  <div key={index} className="p-4 bg-muted/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-card-foreground">{evaluation.team}</h4>
                      <Badge className="bg-green-500/10 text-green-500">Score: {evaluation.score}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{evaluation.project}</p>
                    <p className="text-xs text-muted-foreground">{evaluation.time}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Pending Teams */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-card-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Pending Evaluations
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/evaluator/teams">
                      View All <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingTeams.map((team, index) => (
                  <div key={index} className="p-4 bg-muted/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-card-foreground">{team.team}</h4>
                      <Badge variant="outline" className="text-xs">
                        {team.members} members
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{team.project}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">Due: {team.deadline}</p>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Evaluate
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </EvaluatorLayout>
  )
}

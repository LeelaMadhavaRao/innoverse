"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Users, Mail, Calendar, ImageIcon, Trophy, Activity } from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    { title: "Total Users", value: "156", icon: Users, change: "+12", color: "text-green-500" },
    { title: "Emails Sent", value: "89", icon: Mail, change: "+23", color: "text-blue-500" },
    { title: "Active Teams", value: "42", icon: Trophy, change: "+5", color: "text-purple-500" },
    { title: "Gallery Photos", value: "234", icon: ImageIcon, change: "+18", color: "text-orange-500" },
  ]

  const recentActivities = [
    { action: "New team registered", user: "Team Alpha", time: "2 minutes ago", type: "registration" },
    { action: "Credentials sent", user: "evaluator@university.edu", time: "5 minutes ago", type: "email" },
    { action: "Photo uploaded", user: "Team Beta", time: "10 minutes ago", type: "gallery" },
    { action: "Invitation sent", user: "faculty@university.edu", time: "15 minutes ago", type: "email" },
    { action: "Team details updated", user: "Team Gamma", time: "20 minutes ago", type: "update" },
  ]

  const getActivityColor = (type: string) => {
    const colors = {
      registration: "bg-green-500/10 text-green-500",
      email: "bg-blue-500/10 text-blue-500",
      gallery: "bg-purple-500/10 text-purple-500",
      update: "bg-orange-500/10 text-orange-500",
    }
    return colors[type as keyof typeof colors] || "bg-muted text-muted-foreground"
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your event and monitor system activity</p>
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
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <Activity className="w-5 h-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-card-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.user}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${getActivityColor(activity.type)}`}>{activity.type}</Badge>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <Calendar className="w-5 h-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Card className="bg-muted/20 border-border cursor-pointer hover:bg-muted/30 transition-colors">
                    <CardContent className="p-4 text-center">
                      <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-sm font-medium text-card-foreground">Add Users</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/20 border-border cursor-pointer hover:bg-muted/30 transition-colors">
                    <CardContent className="p-4 text-center">
                      <Mail className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-sm font-medium text-card-foreground">Send Emails</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/20 border-border cursor-pointer hover:bg-muted/30 transition-colors">
                    <CardContent className="p-4 text-center">
                      <ImageIcon className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-sm font-medium text-card-foreground">Manage Gallery</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/20 border-border cursor-pointer hover:bg-muted/30 transition-colors">
                    <CardContent className="p-4 text-center">
                      <Trophy className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-sm font-medium text-card-foreground">Poster Launch</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  )
}

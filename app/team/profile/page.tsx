"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TeamLayout } from "@/components/team/team-layout"
import { Users, Edit, Save } from "lucide-react"

export default function TeamProfile() {
  const [teamData, setTeamData] = useState({
    name: "Team Alpha",
    id: "TEAM001",
    project: "AI-Powered Learning Platform",
    description:
      "An innovative learning platform that uses artificial intelligence to personalize education content and provide real-time feedback to students.",
  })

  const [members, setMembers] = useState([
    { id: 1, name: "John Smith", email: "john@students.edu", role: "Team Lead", isEditing: false },
    { id: 2, name: "Sarah Johnson", email: "sarah@students.edu", role: "Frontend Developer", isEditing: false },
    { id: 3, name: "Mike Chen", email: "mike@students.edu", role: "Backend Developer", isEditing: false },
    { id: 4, name: "Lisa Wang", email: "lisa@students.edu", role: "UI/UX Designer", isEditing: false },
  ])

  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const availableRoles = [
    "Team Lead",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "UI/UX Designer",
    "Data Scientist",
    "DevOps Engineer",
    "Product Manager",
    "Quality Assurance",
  ]

  const handleEditMember = (id: number) => {
    setMembers(members.map((member) => (member.id === id ? { ...member, isEditing: true } : member)))
  }

  const handleSaveMember = (id: number) => {
    setMembers(members.map((member) => (member.id === id ? { ...member, isEditing: false } : member)))
    setMessage("Member role updated successfully!")
    setTimeout(() => setMessage(""), 3000)
  }

  const handleRoleChange = (id: number, newRole: string) => {
    setMembers(members.map((member) => (member.id === id ? { ...member, role: newRole } : member)))
  }

  const handleSaveTeamInfo = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setMessage("Team information updated successfully!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Error updating team information")
    } finally {
      setLoading(false)
    }
  }

  const getRoleColor = (role: string) => {
    const colors = {
      "Team Lead": "bg-red-500/10 text-red-500",
      "Frontend Developer": "bg-blue-500/10 text-blue-500",
      "Backend Developer": "bg-green-500/10 text-green-500",
      "Full Stack Developer": "bg-purple-500/10 text-purple-500",
      "UI/UX Designer": "bg-pink-500/10 text-pink-500",
      "Data Scientist": "bg-orange-500/10 text-orange-500",
      "DevOps Engineer": "bg-teal-500/10 text-teal-500",
      "Product Manager": "bg-indigo-500/10 text-indigo-500",
      "Quality Assurance": "bg-yellow-500/10 text-yellow-500",
    }
    return colors[role as keyof typeof colors] || "bg-muted text-muted-foreground"
  }

  return (
    <TeamLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-3xl font-bold text-foreground">Team Profile</h1>
          <p className="text-muted-foreground">Manage your team information and member roles</p>
        </motion.div>

        {/* Message Alert */}
        {message && (
          <Alert className="border-primary/50 bg-primary/10">
            <AlertDescription className="text-primary">{message}</AlertDescription>
          </Alert>
        )}

        {/* Team Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Users className="w-5 h-5 text-primary" />
                Team Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teamName" className="text-card-foreground">
                    Team Name
                  </Label>
                  <Input
                    id="teamName"
                    value={teamData.name}
                    onChange={(e) => setTeamData({ ...teamData, name: e.target.value })}
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamId" className="text-card-foreground">
                    Team ID
                  </Label>
                  <Input id="teamId" value={teamData.id} disabled className="bg-muted border-border" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="project" className="text-card-foreground">
                  Project Title
                </Label>
                <Input
                  id="project"
                  value={teamData.project}
                  onChange={(e) => setTeamData({ ...teamData, project: e.target.value })}
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-card-foreground">
                  Project Description
                </Label>
                <textarea
                  id="description"
                  value={teamData.description}
                  onChange={(e) => setTeamData({ ...teamData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-card-foreground resize-none"
                />
              </div>
              <Button onClick={handleSaveTeamInfo} disabled={loading} className="bg-primary hover:bg-primary/90">
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save Team Info"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Team Members */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-card-foreground">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Team Members ({members.length})
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {members.map((member) => (
                <div key={member.id} className="p-4 bg-muted/20 rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-card-foreground">{member.name}</h3>
                        {member.isEditing ? (
                          <Select value={member.role} onValueChange={(value) => handleRoleChange(member.id, value)}>
                            <SelectTrigger className="w-48 bg-input border-border">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {availableRoles.map((role) => (
                                <SelectItem key={role} value={role}>
                                  {role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge className={getRoleColor(member.role)}>{member.role}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {member.isEditing ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSaveMember(member.id)}
                          className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white bg-transparent"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditMember(member.id)}
                          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit Role
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </TeamLayout>
  )
}

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Plus, Mail, Edit, Trash2, Users } from "lucide-react"

export default function UserManagement() {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@university.edu", role: "evaluator", status: "active" },
    { id: 2, name: "Team Alpha", email: "alpha@students.edu", role: "team", status: "active", teamId: "TEAM001" },
    { id: 3, name: "Jane Smith", email: "jane@university.edu", role: "evaluator", status: "active" },
  ])

  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "", teamId: "" })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleAddUser = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const user = {
        id: users.length + 1,
        ...newUser,
        status: "active",
      }

      setUsers([...users, user])
      setNewUser({ name: "", email: "", role: "", teamId: "" })
      setIsAddUserOpen(false)
      setMessage("User created and credentials sent successfully!")

      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Error creating user")
    } finally {
      setLoading(false)
    }
  }

  const handleSendCredentials = async (userId: number) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setMessage("Credentials sent successfully!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Error sending credentials")
    } finally {
      setLoading(false)
    }
  }

  const getRoleColor = (role: string) => {
    const colors = {
      admin: "bg-red-500/10 text-red-500",
      evaluator: "bg-blue-500/10 text-blue-500",
      team: "bg-green-500/10 text-green-500",
    }
    return colors[role as keyof typeof colors] || "bg-muted text-muted-foreground"
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground">Create and manage user accounts</p>
          </div>

          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-card-foreground">Create New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-card-foreground">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="Enter full name"
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-card-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="Enter email address"
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-card-foreground">
                    Role
                  </Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="evaluator">Evaluator</SelectItem>
                      <SelectItem value="team">Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newUser.role === "team" && (
                  <div className="space-y-2">
                    <Label htmlFor="teamId" className="text-card-foreground">
                      Team ID
                    </Label>
                    <Input
                      id="teamId"
                      value={newUser.teamId}
                      onChange={(e) => setNewUser({ ...newUser, teamId: e.target.value })}
                      placeholder="Enter team ID (e.g., TEAM001)"
                      className="bg-input border-border"
                    />
                  </div>
                )}
                <Button
                  onClick={handleAddUser}
                  disabled={loading || !newUser.name || !newUser.email || !newUser.role}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {loading ? "Creating..." : "Create User & Send Credentials"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Message Alert */}
        {message && (
          <Alert className="border-primary/50 bg-primary/10">
            <AlertDescription className="text-primary">{message}</AlertDescription>
          </Alert>
        )}

        {/* Users List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Users className="w-5 h-5 text-primary" />
                All Users ({users.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-card-foreground">{user.name}</h3>
                        <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                        {user.teamId && (
                          <Badge variant="outline" className="text-xs">
                            {user.teamId}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendCredentials(user.id)}
                        disabled={loading}
                        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        Send Credentials
                      </Button>
                      <Button variant="outline" size="sm" className="border-border bg-transparent">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  )
}

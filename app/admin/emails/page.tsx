"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Mail, Send, Plus, Clock, CheckCircle, XCircle } from "lucide-react"

export default function EmailSystem() {
  const [emails, setEmails] = useState([
    {
      id: 1,
      recipient: "faculty@university.edu",
      subject: "Event Invitation - Academic Excellence Summit",
      type: "invitation",
      status: "sent",
      sentAt: "2024-03-10 10:30 AM",
    },
    {
      id: 2,
      recipient: "evaluator@university.edu",
      subject: "Login Credentials - Event Management System",
      type: "credentials",
      status: "sent",
      sentAt: "2024-03-10 09:15 AM",
    },
    {
      id: 3,
      recipient: "team@students.edu",
      subject: "Login Credentials - Event Management System",
      type: "credentials",
      status: "pending",
      sentAt: null,
    },
  ])

  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [newEmail, setNewEmail] = useState({
    recipients: "",
    subject: "",
    message: "",
    type: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSendEmail = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const email = {
        id: emails.length + 1,
        recipient: newEmail.recipients,
        subject: newEmail.subject,
        type: newEmail.type,
        status: "sent",
        sentAt: new Date().toLocaleString(),
      }

      setEmails([email, ...emails])
      setNewEmail({ recipients: "", subject: "", message: "", type: "" })
      setIsComposeOpen(false)
      setMessage("Email sent successfully!")

      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Error sending email")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      sent: "bg-green-500/10 text-green-500",
      pending: "bg-yellow-500/10 text-yellow-500",
      failed: "bg-red-500/10 text-red-500",
    }
    return colors[status as keyof typeof colors] || "bg-muted text-muted-foreground"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "failed":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const emailTemplates = {
    invitation: {
      subject: "Invitation: Academic Excellence & Cultural Innovation Summit 2024",
      message: `Dear Faculty Member,

You are cordially invited to our upcoming Academic Excellence & Cultural Innovation Summit 2024.

Event Details:
- Date: March 15-17, 2024
- Venue: University Main Auditorium
- Time: 9:00 AM onwards

This three-day summit celebrates academic achievement and cultural diversity, bringing together students, faculty, and industry experts.

We look forward to your presence at this exceptional event.

Best regards,
Event Management Team`,
    },
    credentials: {
      subject: "Login Credentials - Event Management System",
      message: `Hello,

Your account has been created for the Event Management System. Here are your login credentials:

Email: [USER_EMAIL]
Password: [GENERATED_PASSWORD]
Role: [USER_ROLE]

Please login at: [LOGIN_URL]

For security, please change your password after first login.

Best regards,
Event Management Team`,
    },
  }

  const handleTemplateSelect = (type: string) => {
    const template = emailTemplates[type as keyof typeof emailTemplates]
    if (template) {
      setNewEmail({
        ...newEmail,
        type,
        subject: template.subject,
        message: template.message,
      })
    }
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
            <h1 className="text-3xl font-bold text-foreground">Email System</h1>
            <p className="text-muted-foreground">Send invitations and credentials to users</p>
          </div>

          <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Compose Email
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-card-foreground">Compose Email</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-card-foreground">
                    Email Type
                  </Label>
                  <Select
                    value={newEmail.type}
                    onValueChange={(value) => {
                      setNewEmail({ ...newEmail, type: value })
                      handleTemplateSelect(value)
                    }}
                  >
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Select email type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="invitation">Faculty Invitation</SelectItem>
                      <SelectItem value="credentials">Login Credentials</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipients" className="text-card-foreground">
                    Recipients
                  </Label>
                  <Input
                    id="recipients"
                    value={newEmail.recipients}
                    onChange={(e) => setNewEmail({ ...newEmail, recipients: e.target.value })}
                    placeholder="Enter email addresses (comma separated)"
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-card-foreground">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    value={newEmail.subject}
                    onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })}
                    placeholder="Enter email subject"
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-card-foreground">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    value={newEmail.message}
                    onChange={(e) => setNewEmail({ ...newEmail, message: e.target.value })}
                    placeholder="Enter email message"
                    rows={8}
                    className="bg-input border-border"
                  />
                </div>
                <Button
                  onClick={handleSendEmail}
                  disabled={loading || !newEmail.recipients || !newEmail.subject || !newEmail.message}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {loading ? "Sending..." : "Send Email"}
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

        {/* Email History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Mail className="w-5 h-5 text-primary" />
                Email History ({emails.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emails.map((email) => (
                  <div
                    key={email.id}
                    className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-card-foreground">{email.subject}</h3>
                        <Badge variant="outline" className="text-xs">
                          {email.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">To: {email.recipient}</p>
                      {email.sentAt && <p className="text-xs text-muted-foreground">Sent: {email.sentAt}</p>}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getStatusColor(email.status)} flex items-center gap-1`}>
                        {getStatusIcon(email.status)}
                        {email.status}
                      </Badge>
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

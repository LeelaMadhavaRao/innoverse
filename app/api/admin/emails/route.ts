import { type NextRequest, NextResponse } from "next/server"
import { sendInvitationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { recipients, subject, message, type } = await request.json()

    const recipientList = recipients.split(",").map((email: string) => email.trim())

    // Send emails to all recipients
    for (const recipient of recipientList) {
      if (type === "invitation") {
        const eventDetails = {
          name: "Academic Excellence & Cultural Innovation Summit 2024",
          date: "March 15-17, 2024",
          venue: "University Main Auditorium",
          description: message,
        }
        await sendInvitationEmail(recipient, eventDetails)
      } else {
        // For other email types, use a generic email sender
        // This would be implemented based on your email service
        console.log(`Sending ${type} email to ${recipient}`)
      }
    }

    return NextResponse.json({
      message: "Emails sent successfully",
      count: recipientList.length,
    })
  } catch (error) {
    console.error("Send email error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

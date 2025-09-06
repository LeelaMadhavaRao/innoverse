import nodemailer from "nodemailer"

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendLoginCredentials(email: string, password: string, role: string) {
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1a1a1a; color: #ffffff; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #2a2a2a; border-radius: 10px; padding: 30px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #ff5722; }
        .credentials { background-color: #3a3a3a; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .button { display: inline-block; background-color: #ff5722; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Event Management System</div>
          <h2>Your Login Credentials</h2>
        </div>
        <p>Hello,</p>
        <p>You have been registered as a <strong>${role}</strong> for our upcoming event. Here are your login credentials:</p>
        <div class="credentials">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Password:</strong> ${password}</p>
          <p><strong>Role:</strong> ${role}</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" class="button">Login to Dashboard</a>
        <p>Please keep these credentials secure and change your password after first login.</p>
        <p>Best regards,<br>Event Management Team</p>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: `Event Management System - Login Credentials (${role})`,
    html: htmlTemplate,
  })
}

export async function sendInvitationEmail(email: string, eventDetails: any) {
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1a1a1a; color: #ffffff; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #2a2a2a; border-radius: 10px; padding: 30px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #ff5722; }
        .event-details { background-color: #3a3a3a; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .button { display: inline-block; background-color: #ff5722; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Event Management System</div>
          <h2>You're Invited!</h2>
        </div>
        <p>Dear Faculty Member,</p>
        <p>You are cordially invited to our upcoming academic/cultural event:</p>
        <div class="event-details">
          <h3>${eventDetails.name}</h3>
          <p><strong>Date:</strong> ${eventDetails.date}</p>
          <p><strong>Venue:</strong> ${eventDetails.venue}</p>
          <p><strong>Description:</strong> ${eventDetails.description}</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}" class="button">View Event Details</a>
        <p>We look forward to your presence at this event.</p>
        <p>Best regards,<br>Event Management Team</p>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: `Invitation: ${eventDetails.name}`,
    html: htmlTemplate,
  })
}

import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { hashPassword, generateRandomPassword } from "@/lib/auth"
import { sendLoginCredentials } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { name, email, role, teamId } = await request.json()

    const client = await clientPromise
    const db = client.db("event_management")

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Generate random password
    const password = generateRandomPassword()
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = {
      name,
      email,
      password: hashedPassword,
      role,
      teamId: role === "team" ? teamId : undefined,
      createdAt: new Date(),
    }

    const result = await db.collection("users").insertOne(user)

    // Send login credentials via email
    await sendLoginCredentials(email, password, role)

    return NextResponse.json({
      message: "User created and credentials sent successfully",
      userId: result.insertedId,
    })
  } catch (error) {
    console.error("Create user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("event_management")

    const users = await db
      .collection("users")
      .find({}, { projection: { password: 0 } })
      .toArray()

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

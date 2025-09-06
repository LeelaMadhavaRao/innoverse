import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== "team") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { teamInfo, members } = await request.json()

    const client = await clientPromise
    const db = client.db("event_management")

    // Update team information
    await db.collection("teams").updateOne(
      { _id: decoded.userId },
      {
        $set: {
          ...teamInfo,
          members,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({
      message: "Team profile updated successfully",
    })
  } catch (error) {
    console.error("Update team profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== "team") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("event_management")

    const team = await db.collection("teams").findOne({ _id: decoded.userId })

    return NextResponse.json({ team })
  } catch (error) {
    console.error("Get team profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

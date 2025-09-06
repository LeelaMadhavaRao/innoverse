import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("event_management")

    await db.collection("gallery").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          approved: true,
          approvedAt: new Date(),
          approvedBy: decoded.userId,
        },
      },
    )

    return NextResponse.json({ message: "Image approved successfully" })
  } catch (error) {
    console.error("Approve image error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

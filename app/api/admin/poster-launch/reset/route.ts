import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    const result = await db.collection("poster_config").findOneAndUpdate(
      {},
      {
        $set: {
          isLaunched: false,
          updatedAt: new Date(),
        },
        $unset: { launchDate: "" },
      },
      { returnDocument: "after" },
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error resetting poster:", error)
    return NextResponse.json({ error: "Failed to reset poster" }, { status: 500 })
  }
}

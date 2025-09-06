import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    const posterConfig = await db.collection("poster_config").findOne({})

    if (!posterConfig) {
      // Return default config if none exists
      return NextResponse.json({
        title: "Event Poster Reveal",
        description: "Get ready for an amazing event experience!",
        imageUrl: "/placeholder.svg?height=600&width=400&text=Event+Poster",
        isLaunched: false,
      })
    }

    return NextResponse.json(posterConfig)
  } catch (error) {
    console.error("Error fetching poster config:", error)
    return NextResponse.json({ error: "Failed to fetch poster configuration" }, { status: 500 })
  }
}

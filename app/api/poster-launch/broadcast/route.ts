import { type NextRequest, NextResponse } from "next/server"
import { broadcastToClients } from "@/lib/sse-clients"

export async function POST(request: NextRequest) {
  try {
    const { type } = await request.json()

    // Broadcast to all connected clients using shared system
    const clientCount = broadcastToClients({ type })

    return NextResponse.json({ success: true, clientCount })
  } catch (error) {
    console.error("Error broadcasting message:", error)
    return NextResponse.json({ error: "Failed to broadcast message" }, { status: 500 })
  }
}

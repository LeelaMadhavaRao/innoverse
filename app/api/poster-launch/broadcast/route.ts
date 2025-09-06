import { type NextRequest, NextResponse } from "next/server"

const clients: Array<{ id: string; controller: ReadableStreamDefaultController }> = []

// Import clients array from events route (in a real app, use Redis or similar)
export async function POST(request: NextRequest) {
  try {
    const { type } = await request.json()

    console.log(`[v0] Broadcasting ${type} to ${clients.length} clients`)

    // Broadcast to all connected clients
    clients.forEach((client) => {
      try {
        client.controller.enqueue(`data: ${JSON.stringify({ type })}\n\n`)
      } catch (error) {
        console.error(`[v0] Error sending to client ${client.id}:`, error)
      }
    })

    return NextResponse.json({ success: true, clientCount: clients.length })
  } catch (error) {
    console.error("Error broadcasting message:", error)
    return NextResponse.json({ error: "Failed to broadcast message" }, { status: 500 })
  }
}

// Export clients array so it can be shared with events route
export { clients }

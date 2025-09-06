import type { NextRequest } from "next/server"
import { addClient, removeClient } from "@/lib/sse-clients"

export async function GET(request: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const clientId = Math.random().toString(36).substring(7)

      // Add client to shared array
      addClient({ id: clientId, controller })

      // Send initial connection message
      controller.enqueue(`data: ${JSON.stringify({ type: "CONNECTED", clientId })}\n\n`)

      // Cleanup on disconnect
      request.signal.addEventListener("abort", () => {
        removeClient(clientId)
        try {
          controller.close()
        } catch (error) {
          // Controller might already be closed
        }
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  })
}

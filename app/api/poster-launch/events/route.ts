import type { NextRequest } from "next/server"

let clients: Array<{ id: string; controller: ReadableStreamDefaultController }> = []

export async function GET(request: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const clientId = Math.random().toString(36).substring(7)
      clients.push({ id: clientId, controller })

      console.log(`[v0] SSE client connected: ${clientId}`)

      // Send initial connection message
      controller.enqueue(`data: ${JSON.stringify({ type: "CONNECTED", clientId })}\n\n`)

      // Cleanup on disconnect
      request.signal.addEventListener("abort", () => {
        console.log(`[v0] SSE client disconnected: ${clientId}`)
        clients = clients.filter((client) => client.id !== clientId)
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

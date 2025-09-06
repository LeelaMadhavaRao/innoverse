interface SSEClient {
  id: string
  controller: ReadableStreamDefaultController
}

let clients: SSEClient[] = []

export function addClient(client: SSEClient) {
  clients.push(client)
  console.log(`[v0] SSE client connected: ${client.id}. Total clients: ${clients.length}`)
}

export function removeClient(clientId: string) {
  clients = clients.filter((client) => client.id !== clientId)
  console.log(`[v0] SSE client disconnected: ${clientId}. Total clients: ${clients.length}`)
}

export function broadcastToClients(message: any) {
  console.log(`[v0] Broadcasting ${message.type} to ${clients.length} clients`)

  clients.forEach((client, index) => {
    try {
      client.controller.enqueue(`data: ${JSON.stringify(message)}\n\n`)
    } catch (error) {
      console.error(`[v0] Error sending to client ${client.id}:`, error)
      // Remove dead client
      clients.splice(index, 1)
    }
  })

  return clients.length
}

export function getClientCount() {
  return clients.length
}

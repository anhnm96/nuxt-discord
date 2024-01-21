import type { Server } from 'node:http'
import { Server as SocketServer } from 'socket.io'

export default defineEventHandler((event) => {
  if (!event.context.io) {
    const path = '/api/socket/io'
    const httpServer = (event.node.req.socket as any).server as Server
    const io = new SocketServer(httpServer, {
      path,
      addTrailingSlash: false,
    })
    event.context.io = io
  }
})

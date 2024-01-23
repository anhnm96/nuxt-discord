import type { Server } from 'node:http'
import { Server as SocketServer } from 'socket.io'
import socketServer from '@/lib/socket'

export default defineEventHandler((event) => {
  if (!socketServer.io) {
    const path = '/api/socket/io'
    const httpServer = (event.node.req.socket as any).server as Server
    socketServer.io = new SocketServer(httpServer, {
      path,
      addTrailingSlash: false,
    })
  }
})

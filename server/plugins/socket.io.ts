// import type { Server } from 'node:http'
import { Server as SocketServer } from 'socket.io'

export default defineNitroPlugin((_nitroApp) => {
  const path = '/api/socket/io'
  // const httpServer = (event.node.req.socket as any).server as Server
  const socketServer = new SocketServer(3001, {
    path,
    addTrailingSlash: false,
    serveClient: false,
    cors: {
      origin: '*',
    },
  })
  socketServer.on('connection', (socket) => {
    socket.on('message', async (message) => {
      socketServer.emit('message', {
        type: 'user',
        author: message.author,
        content: message.content,
      })
    })
  })
})

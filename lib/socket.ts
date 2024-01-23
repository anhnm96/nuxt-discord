import type { Server } from 'socket.io'

const socketServer: { io?: Server } = {}

socketServer.io?.on('connection', (socket) => {
  socket.on('message', async (message: any) => {
    socketServer.io?.emit('message', {
      type: 'user',
      author: message.author,
      content: message.content,
    })
  })
})

export default socketServer

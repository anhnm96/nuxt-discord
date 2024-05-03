import type { Server } from 'socket.io'
import db from '@/lib/prisma'

const socketServer: { io?: Server; userId?: string; init?: () => void } = {}

socketServer.init = () => {
  socketServer.io?.on('connection', (socket) => {
    socket.on('message', async (message: any) => {
      socketServer.io?.emit('message', {
        type: 'user',
        author: message.author,
        content: message.content,
      })
    })

    socket.on('toggleOnline', async () => {
      const id = socketServer.userId
      if (!id) return
      setOnlineStatus(id, true)
      const serverIds = await db.server.findMany({
        where: {
          members: {
            some: {
              profileId: id,
            },
          },
        },
        select: {
          id: true,
        },
      })
      serverIds.forEach((s) => {
        socket.to(s.id).emit('toggle_online', id)
      })
    })

    socket.on('toggleOffline', async () => {
      const id = socketServer.userId
      if (!id) return
      setOnlineStatus(id, false)
      const serverIds = await db.server.findMany({
        where: {
          members: {
            some: {
              profileId: id,
            },
          },
        },
        select: {
          id: true,
        },
      })
      serverIds.forEach((s) => {
        socket.to(s.id).emit('toggle_offline', id)
      })
    })
  })
}

async function setOnlineStatus(id: string, status: boolean) {
  return db.profile.update({
    where: {
      id,
    },
    data: {
      isOnline: status,
    },
  })
}

export default socketServer

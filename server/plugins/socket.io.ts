import type { NitroApp } from 'nitropack'
import { Server as Engine } from 'engine.io'
import { Server } from 'socket.io'
import { defineEventHandler } from 'h3'
import db from '@/lib/prisma'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const engine = new Engine()
  const io = new Server()

  io.bind(engine)

  io.on('connection', (socket) => {
    socket.on('message', async (message: any) => {
      io.emit('message', {
        type: 'user',
        author: message.author,
        content: message.content,
      })
    })

    socket.on('toggleOnline', async () => {
      // @ts-expect-error
      const id = socket.request.context.auth.sub
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
      // @ts-expect-error
      const id = socket.request.context.auth.sub
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

    socket.on('joinServer', (serverId: string) => {
      socket.join(serverId)
    })

    socket.on('leaveServer', (serverId: string) => {
      socket.leave(serverId)
    })

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
  })

  nitroApp.router.use(
    '/api/ws',
    defineEventHandler({
      handler(event) {
        engine.handleRequest(event.node.req, event.node.res)
        event._handled = true
        // @ts-expect-error
        event.node.req.context = event.context
      },
      websocket: {
        open(peer) {
          const nodeContext = peer.ctx.node
          const req = nodeContext.req

          // @ts-expect-error private method
          engine.prepare(req)

          const rawSocket = nodeContext.req.socket
          const websocket = nodeContext.ws

          // @ts-expect-error private method
          engine.onWebSocket(req, rawSocket, websocket)
        },
      },
    }),
  )
})

import type { NitroApp } from 'nitropack'
import { Server as Engine } from 'engine.io'
import type { Socket } from 'socket.io'
import { Server } from 'socket.io'
import { defineEventHandler } from 'h3'
import db from '@/lib/prisma'
import socketServer from '~/lib/socket'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const engine = new Engine()
  socketServer.io = new Server()

  socketServer.io.bind(engine)

  socketServer.io.on('connection', (socket: Socket) => {
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

    socket.on('startTyping', (channelId, username) => {
      socket.to(channelId).emit('addToTyping', username)
    })

    socket.on('stopTyping', (channelId, username) => {
      socket.to(channelId).emit('removeFromTyping', username)
    })

    socket.on('joinServer', (serverId: string) => {
      socket.join(serverId)
    })

    socket.on('leaveServer', (serverId: string) => {
      socket.leave(serverId)
      // TODO: update last seen of the member
    })

    socket.on('joinUser', (profileId: string) => {
      socket.join(profileId)
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

    socket.on('joinChannel', async (channelId) => {
      // @ts-expect-error
      const userId = socket.request.context.auth.sub
      const channel = await db.server.findFirst({
        where: {
          members: { some: { profileId: userId } },
          categories: { some: { channels: { some: { id: channelId } } } },
        },
      })

      if (!channel) throw createError({ statusMessage: 'Channel not found' })
      socket.join(channelId)
    })

    socket.on('leaveRoom', (id) => {
      socket.leave(id)
    })
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

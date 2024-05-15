import db from '@/lib/prisma'
import socketServer from '~/lib/socket'

export default defineEventHandler(async (event) => {
  const serverId = getRouterParam(event, 'id')

  const server = await db.server.delete({
    where: {
      id: serverId,
      profileId: event.context.auth.sub,
    },
    include: {
      members: true,
    },
  })

  server.members.forEach((m) => {
    socketServer.io?.to(m.profileId).emit('delete_server', server.id)
  })

  return server
})

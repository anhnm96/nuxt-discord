import db from '@/lib/prisma'
import socketServer from '~/lib/socket'

export default defineEventHandler(async (event) => {
  const serverId = getRouterParam(event, 'id')

  if (!serverId)
    throw createError({ statusMessage: 'Server ID Missing', statusCode: 400 })

  const server = await db.server.update({
    where: {
      id: serverId,
      profileId: {
        not: event.context.auth.sub,
      },
      members: {
        some: {
          profileId: event.context.auth.sub,
        },
      },
    },
    data: {
      members: {
        deleteMany: {
          profileId: event.context.auth.sub,
        },
      },
    },
  })

  socketServer.io?.to(serverId).emit('remove_member', event.context.auth.sub)
  // socketServer.io
  //   ?.to(event.context.auth.sub)
  //   .emit('remove_from_guild', serverId)
  return server
})

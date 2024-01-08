import db from '@/lib/prisma'

export default defineEventHandler(async (event) => {
  const serverId = getRouterParam(event, 'id')

  const server = await db.server.delete({
    where: {
      id: serverId,
      profileId: event.context.auth.sub,
    },
  })

  return server
})

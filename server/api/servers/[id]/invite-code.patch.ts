import { nanoid } from 'nanoid'
import db from '@/lib/prisma'

export default defineEventHandler(async (event) => {
  const serverId = getRouterParam(event, 'id')

  if (!serverId)
    throw createError({ statusMessage: 'Server ID Missing', statusCode: 400 })

  const server = await db.server.update({
    where: {
      id: serverId,
      profileId: event.context.auth.sub,
    },
    data: {
      inviteCode: nanoid(),
    },
  })

  return server
})

import { MemberRole } from '@prisma/client'
import db from '@/lib/prisma'
import socketServer from '~/lib/socket'

export default defineEventHandler(async (event) => {
  const { serverId, categoryId } = getQuery<{
    serverId: string
    categoryId: string
  }>(event)
  const { name, type } = await readBody(event)

  if (!serverId)
    return createError({ statusMessage: 'Server ID missing', status: 400 })

  if (name === 'general')
    return createError({
      statusMessage: 'Name cannot be "general"',
      statusCode: 400,
    })

  const category = await db.category.update({
    where: {
      id: categoryId,
      server: {
        id: serverId,
        members: {
          some: {
            profileId: event.context.auth.sub,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
    },
    data: {
      channels: {
        create: [{ name, profileId: event.context.auth.sub, type }],
      },
    },
  })
  socketServer.io?.to(serverId).emit('add_channel', category)
  return category
})

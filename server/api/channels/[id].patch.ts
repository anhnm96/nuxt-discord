import { MemberRole } from '@prisma/client'
import db from '@/lib/prisma'

export default defineEventHandler(async (event) => {
  const { serverId, categoryId } = getQuery<{
    serverId: string
    categoryId: string
  }>(event)

  if (!serverId)
    return createError({ statusMessage: 'Server ID missing', status: 400 })

  if (!categoryId)
    return createError({ statusMessage: 'Category ID missing', status: 400 })

  const channelId = getRouterParam(event, 'id')
  if (!channelId)
    return createError({ statusMessage: 'Channel ID missing', status: 400 })

  const { name } = await readBody(event)

  if (name === 'general')
    return createError({
      statusMessage: 'Name cannot be "general"',
      status: 400,
    })

  const server = await db.category.update({
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
        update: {
          where: {
            id: channelId,
            NOT: {
              name: 'general',
            },
          },
          data: {
            name,
          },
        },
      },
    },
  })

  return server
})

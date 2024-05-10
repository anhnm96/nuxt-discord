import { MemberRole } from '@prisma/client'
import db from '@/lib/prisma'
import socketServer from '~/lib/socket'
import { ChannelSchema } from '~/validations/channel'

export default defineEventHandler(async (event) => {
  const { serverId, categoryId } = getQuery<{
    serverId: string
    categoryId: string
  }>(event)
  const { name, type } = await readValidatedBody(event, ChannelSchema.parse)

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
    include: {
      channels: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  })

  socketServer.io?.to(serverId).emit('add_channel', category)
  return category
})

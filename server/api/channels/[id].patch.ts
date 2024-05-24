import { MemberRole } from '@/types'
import db from '@/lib/prisma'
import socketServer from '~/lib/socket'
import { ChannelSchema } from '~/validations/channel'

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

  const name = await readValidatedBody(event, (body: any) =>
    ChannelSchema.shape.name.parse(body.name),
  )

  if (name === 'general')
    return createError({
      statusMessage: 'Name cannot be "general"',
      status: 400,
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
    include: {
      channels: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  })

  socketServer.io?.to(serverId).emit('edit_channel', category.channels[0])
  return category.channels[0]
})

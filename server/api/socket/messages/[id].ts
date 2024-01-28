import { MemberRole } from '@prisma/client'
import db from '@/lib/prisma'
import socketServer from '@/lib/socket'

export default defineEventHandler(async (event) => {
  const { serverId, channelId } = getQuery<{
    serverId: string
    channelId: string
  }>(event)

  const messageId = getRouterParam(event, 'id')

  const { content } = await readBody(event)

  if (!serverId)
    throw createError({ statusMessage: 'Server ID Missing', statusCode: 400 })

  if (!channelId)
    throw createError({ statusMessage: 'Channel ID Missing', statusCode: 400 })

  const server = await db.server.findFirst({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: event.context.auth.sub,
        },
      },
    },
    include: {
      members: true,
    },
  })

  if (!server)
    throw createError({ statusMessage: 'Server not found', statusCode: 404 })

  const channel = await db.channel.findFirst({
    where: {
      id: channelId,
    },
  })

  if (!channel)
    throw createError({ statusMessage: 'Channel not found', statusCode: 404 })

  const member = server.members.find(
    (member) => member.profileId === event.context.auth.sub,
  )

  if (!member)
    throw createError({ statusMessage: 'Member not found', statusCode: 404 })

  let message = await db.message.findFirst({
    where: {
      id: messageId,
      channelId,
    },
    include: {
      member: {
        include: {
          profile: true,
        },
      },
    },
  })

  if (!message || message.deleted)
    throw createError({ statusMessage: 'Message not found', statusCode: 404 })

  const isMessageOwner = message.memberId === member.id
  const isAdmin = member.role === MemberRole.ADMIN
  const isModerator = member.role === MemberRole.MODERATOR
  const canModify = isMessageOwner || isAdmin || isModerator

  if (!canModify)
    throw createError({ statusMessage: 'Unauthorized', statusCode: 401 })

  if (event.method === 'DELETE') {
    message = await db.message.update({
      where: {
        id: messageId as string,
      },
      data: {
        fileUrl: null,
        content: 'This message has been deleted.',
        deleted: true,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    })
  }

  if (event.method === 'PATCH') {
    if (!isMessageOwner) {
      throw createError({ statusMessage: 'Unauthorized', statusCode: 401 })
    }

    message = await db.message.update({
      where: {
        id: messageId,
      },
      data: {
        content,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    })
  }

  const updateKey = `chat:${channelId}:messages:update`

  socketServer.io?.emit(updateKey, message)

  return message
})

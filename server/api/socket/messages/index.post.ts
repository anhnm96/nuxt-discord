import db from '@/lib/prisma'
import socketServer from '@/lib/socket'

export default defineEventHandler(async (event) => {
  const { content, fileUrl } = await readBody(event)
  const { serverId, channelId } = getQuery<{
    serverId: string
    channelId: string
  }>(event)

  if (!serverId)
    throw createError({ statusMessage: 'Server ID Missing', statusCode: 400 })

  if (!channelId)
    throw createError({ statusMessage: 'Channel ID Missing', statusCode: 400 })

  if (!content)
    throw createError({ statusMessage: 'Content Missing', statusCode: 400 })

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

  const message = await db.message.create({
    data: {
      content,
      fileUrl,
      channelId,
      memberId: member.id,
    },
    include: {
      member: {
        include: {
          profile: true,
        },
      },
    },
  })

  const channelKey = `chat:${channelId}:messages`

  socketServer.io?.emit(channelKey, message)

  return message
})

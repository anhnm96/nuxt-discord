import db from '@/lib/prisma'
import socketServer from '~/lib/socket'

export default defineEventHandler(async (event) => {
  const { inviteCode } = await readBody(event)

  if (!inviteCode)
    throw createError({
      statusCode: 400,
      statusText: 'Invalid link',
    })

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode,
      members: {
        some: {
          profileId: event.context.auth.sub,
        },
      },
    },
  })

  if (existingServer) return { serverId: existingServer.id }

  try {
    const server = await db.server.update({
      where: {
        inviteCode,
      },
      data: {
        members: {
          create: [
            {
              profileId: event.context.auth.sub,
            },
          ],
        },
      },
      include: {
        members: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            profile: true,
          },
        },
      },
    })

    socketServer.io?.to(server.id).emit('add_member', server.members[0])

    return { serverId: server.id }
  } catch (err) {
    throw createError({
      statusCode: 404,
      statusText: 'Invalid link or the server got deleted',
    })
  }
})

import db from '@/lib/prisma'

export default defineEventHandler(async (event) => {
  const { inviteCode } = await readBody(event)

  if (!inviteCode) return { serverId: null }

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
  })

  if (server) return { serverId: server.id }

  return { serverId: null }
})

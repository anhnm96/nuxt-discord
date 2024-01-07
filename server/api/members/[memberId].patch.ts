import db from '@/lib/prisma'

export default defineEventHandler(async (event) => {
  const { serverId } = getQuery<{ serverId: string }>(event)
  const { role } = await readBody(event)

  if (!serverId)
    return createError({ statusMessage: 'Server ID missing', status: 400 })

  const memberId = getRouterParam(event, 'memberId')
  if (!memberId)
    return createError({ statusMessage: 'Member ID missing', status: 400 })

  const server = await db.server.update({
    where: {
      id: serverId,
      profileId: event.context.auth.sub,
    },
    data: {
      members: {
        update: {
          where: {
            id: memberId,
            profileId: {
              not: event.context.auth.sub,
            },
          },
          data: {
            role,
          },
        },
      },
    },
    include: {
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
    },
  })

  return server
})

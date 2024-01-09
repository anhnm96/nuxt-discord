import db from '@/lib/prisma'

export default defineEventHandler(async (event) => {
  const serverId = getRouterParam(event, 'id')
  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      categories: {
        orderBy: {
          name: 'asc',
        },
        include: {
          channels: true,
        },
      },
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

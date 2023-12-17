import db from '@/lib/prisma'

export default defineEventHandler(async (event) => {
  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: event.context.auth.sub,
        },
      },
    },
  })

  return servers
})

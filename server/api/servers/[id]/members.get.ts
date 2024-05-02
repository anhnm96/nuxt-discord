import db from '@/lib/prisma'

export default defineEventHandler(async (event) => {
  const serverId = getRouterParam(event, 'id')
  const members = await db.member.findMany({
    where: {
      serverId,
    },
    include: {
      profile: true,
    },
  })

  return members
})

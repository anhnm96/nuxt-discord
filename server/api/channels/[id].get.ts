import db from '@/lib/prisma'

export default defineEventHandler(async (event) => {
  const channelId = getRouterParam(event, 'id')
  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
    include: {
      profile: true,
      category: true,
    },
  })

  return channel
})

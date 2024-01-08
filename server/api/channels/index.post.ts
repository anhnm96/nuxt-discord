import { MemberRole } from '@prisma/client'
import db from '@/lib/prisma'

export default defineEventHandler(async (event) => {
  const { serverId } = getQuery<{ serverId: string }>(event)
  const { categoryName, name, type } = await readBody(event)

  if (!serverId)
    return createError({ statusMessage: 'Server ID missing', status: 400 })

  if (name === 'general')
    return createError({
      statusMessage: 'Name cannot be "general"',
      statusCode: 400,
    })

  const server = await db.server.update({
    where: {
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
    data: {
      categories: {
        create: {
          name: categoryName,
          channels: {
            create: [{ name, profileId: event.context.auth.sub, type }],
          },
        },
      },
    },
  })

  return server
})

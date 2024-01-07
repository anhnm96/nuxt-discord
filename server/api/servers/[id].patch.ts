import db from '@/lib/prisma'

interface UpdateServerDto {
  name: string
  imageUrl: string
}

export default defineEventHandler(async (event) => {
  const serverId = getRouterParam(event, 'id')
  const { name, imageUrl } = await readBody<UpdateServerDto>(event)

  const server = await db.server.update({
    where: {
      id: serverId,
      profileId: event.context.auth.sub,
    },
    data: {
      name,
      imageUrl,
    },
  })

  return server
})

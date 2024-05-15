import db from '@/lib/prisma'
import socketServer from '~/lib/socket'

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

  // emit socket
  const members = await db.member.findMany({
    where: {
      serverId,
    },
  })

  members.forEach((m) => {
    socketServer.io?.to(m.profileId).emit('edit_server', server)
  })

  return server
})

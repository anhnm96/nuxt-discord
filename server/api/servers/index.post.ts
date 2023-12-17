import { nanoid } from 'nanoid'
import { MemberRole } from '@prisma/client'
import db from '@/lib/prisma'

interface CreateServerDto {
  name: string
  imageUrl: string
}

export default defineEventHandler(async (event) => {
  const { name, imageUrl } = await readBody<CreateServerDto>(event)

  const server = await db.server.create({
    data: {
      profileId: event.context.auth.sub,
      name,
      imageUrl,
      inviteCode: nanoid(),
      channels: {
        create: [{ name: 'general', profileId: event.context.auth.sub }],
      },
      members: {
        create: [{ profileId: event.context.auth.sub, role: MemberRole.ADMIN }],
      },
    },
  })

  return server
})

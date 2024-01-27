import type { Message } from '@prisma/client'
import db from '@/lib/prisma'

const MESSAGES_BATCH = 10

export default defineEventHandler(async (event) => {
  let { channelId, cursor } = getQuery<{
    channelId: string
    cursor: string | number
  }>(event)

  if (!channelId)
    throw createError({ statusMessage: 'Channel ID Missing', statusCode: 400 })

  let messages: Message[] = []

  cursor = Number(cursor)

  if (cursor > 1) {
    messages = await db.message.findMany({
      take: MESSAGES_BATCH,
      skip: 1,
      cursor: {
        id: String(cursor),
      },
      where: {
        channelId,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  } else {
    messages = await db.message.findMany({
      take: MESSAGES_BATCH,
      where: {
        channelId,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  let nextCursor = null

  if (messages.length === MESSAGES_BATCH) {
    nextCursor = messages[MESSAGES_BATCH - 1].id
  }

  return {
    items: messages,
    nextCursor,
  }
})

import db from '@/lib/prisma'

export default defineEventHandler(async (event) => {
  const id = event.context.auth.sub

  if (!id) return null

  const profile = await db.profile.findUnique({
    where: {
      id,
    },
  })

  return profile
})

import jwt from 'jsonwebtoken'

export default defineEventHandler((event) => {
  // protect all routes except /api/auth
  if (
    !event.node.req.url?.startsWith('/api') ||
    event.node.req.url?.startsWith('/api/auth')
  )
    return

  const config = useRuntimeConfig(event)
  const [_, token] = getHeader(event, 'authorization')?.split(' ') ?? []
  if (!token)
    throw createError({ statusMessage: 'Unauthenticated', statusCode: 401 })

  try {
    const payload = jwt.verify(token, config.secret)
    event.context.auth = payload
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      // TODO: handle token expired
    }
    throw createError({ statusMessage: 'Unauthenticated', statusCode: 401 })
  }
})

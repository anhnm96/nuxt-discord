import { randomUUID } from 'node:crypto'
import type { H3Event } from 'h3'
import type { Profile } from '@prisma/client'
import jwt from 'jsonwebtoken'
import type { ActiveUserData } from '@/types'

export default async (event: H3Event, user: Profile) => {
  const config = useRuntimeConfig(event)

  function generateTokens() {
    const refreshTokenId = randomUUID()
    const accessToken = signToken<Partial<ActiveUserData>>(
      user.id,
      +config.jwtAccessTokenTtl,
      {
        email: user.email,
      },
    )
    const refreshToken = signToken(user.id, +config.jwtRefreshTokenTtl, {
      refreshTokenId,
    })
    // await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId)
    return { accessToken, refreshToken }
  }

  function signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return jwt.sign({ sub: userId, ...payload }, config.jwtSecret, {
      audience: config.jwtTokenAudience,
      issuer: config.jwtTokenIssuer,
      expiresIn,
    })
  }

  const tokens = generateTokens()
  const expiresAt = Date.now() + Number(config.jwtAccessTokenTtl) * 1000
  setCookie(event, 'accessToken', tokens.accessToken, {
    maxAge: +config.jwtAccessTokenTtl,
    expires: new Date(expiresAt),
    httpOnly: true,
    sameSite: 'lax',
  })

  return { ...tokens, user, expiresAt }
}

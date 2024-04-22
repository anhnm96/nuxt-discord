import { randomUUID } from 'node:crypto'
import { compare } from 'bcrypt'
import type { Profile } from '@prisma/client'
import jwt from 'jsonwebtoken'
import db from '@/lib/prisma'
import type { ActiveUserData } from '@/types'
import { loginSchema } from '@/validations/auth'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  function generateTokens(user: Profile) {
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

  const signInDto = await readValidatedBody(event, loginSchema.parse)
  const user = await db.profile.findFirst({
    where: {
      email: signInDto.email,
    },
  })

  if (!user) throw new Error('User does not exists')

  const isEqual = await compare(signInDto.password, user.password)
  if (!isEqual) throw new Error('Password does not match')

  const tokens = generateTokens(user)
  const expiresAt = Date.now() + Number(config.jwtAccessTokenTtl) * 1000
  setCookie(event, 'accessToken', tokens.accessToken, {
    maxAge: +config.jwtAccessTokenTtl,
    expires: new Date(expiresAt),
    httpOnly: true,
    sameSite: 'lax',
  })

  return { ...tokens, user, expiresAt }
})

import { randomUUID } from 'node:crypto'
import { compare } from 'bcrypt'
import type { Profile } from '@prisma/client'
import jwt from 'jsonwebtoken'
import db from '@/lib/prisma'
import type { ActiveUserData } from '@/types'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  async function generateTokens(user: Profile) {
    const refreshTokenId = randomUUID()
    const accessToken = signToken<Partial<ActiveUserData>>(
      user.id,
      config.accessTokenTtl,
      {
        email: user.email,
      },
    )
    const refreshToken = signToken(user.id, config.refreshTokenTtl, {
      refreshTokenId,
    })
    // await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId)
    return { accessToken, refreshToken }
  }

  function signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return jwt.sign({ sub: userId, ...payload }, config.secret, {
      audience: config.audience,
      issuer: config.issuer,
      expiresIn,
    })
  }

  const signInDto = await readBody(event)
  const user = await db.profile.findFirst({
    where: {
      userId: signInDto.email,
    },
  })

  if (!user) throw new Error('User does not exists')

  const isEqual = await compare(signInDto.password, user.password)
  if (!isEqual) throw new Error('Password does not match')

  return { ...generateTokens(user), ...user }
})

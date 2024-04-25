import { compare } from 'bcrypt'
import db from '@/lib/prisma'
import { loginSchema } from '@/validations/auth'

export default defineEventHandler(async (event) => {
  const signInDto = await readValidatedBody(event, loginSchema.parse)
  const user = await db.profile.findFirst({
    where: {
      email: signInDto.email,
    },
  })

  if (!user)
    throw createError({ status: 401, statusMessage: 'User does not exist' })

  const isEqual = await compare(signInDto.password, user.password)
  if (!isEqual)
    throw createError({
      status: 401,
      statusMessage: 'Incorrect email or password',
    })

  return login(event, user)
})

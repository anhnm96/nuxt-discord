import { genSalt, hash } from 'bcrypt'
import db from '@/lib/prisma'
import { registerSchema } from '@/validations/auth'

export default defineEventHandler(async (event) => {
  const { email, username, password } = await readValidatedBody(
    event,
    registerSchema.parse,
  )
  const salt = await genSalt()
  const hashedPassword = await hash(password, salt)

  // save user to db
  const user = await db.profile.create({
    data: {
      email,
      username,
      password: hashedPassword,
    },
  })

  return login(event, user)
})

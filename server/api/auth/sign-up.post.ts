import { genSalt, hash } from 'bcrypt'
import db from '@/lib/prisma'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)
  const salt = await genSalt()
  const hashedPassword = await hash(password, salt)

  // save user to db
  await db.profile.create({
    data: {
      email,
      password: hashedPassword,
    },
  })
})

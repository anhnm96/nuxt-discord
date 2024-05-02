import { createHash } from 'node:crypto'
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
  const hashedEmail = createHash('sha256').update(email).digest('hex')
  const imageUrl = `https://gravatar.com/avatar/${hashedEmail}?d=identicon`
  // save user to db
  const user = await db.profile.create({
    data: {
      email,
      username,
      password: hashedPassword,
      imageUrl,
    },
  })

  return login(event, user)
})

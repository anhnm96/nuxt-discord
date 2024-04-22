import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(6),
})

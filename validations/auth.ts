import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(150),
})

export const registerSchema = z.object({
  username: z.string().min(3).max(30).trim(),
  email: z.string().email().toLowerCase(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(150),
})

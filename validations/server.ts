import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

export const ServerSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, {
      message: 'Server name is required.',
    }),
    // imageUrl: z.string().min(1, {
    //   message: 'Server image is required.',
    // }),
  }),
)

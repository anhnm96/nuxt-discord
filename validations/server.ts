import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

const ServerSchemaObj = z.object({
  name: z.string().min(1, {
    message: 'Server name is required.',
  }),
  // imageUrl: z.string().min(1, {
  //   message: 'Server image is required.',
  // }),
})

export type ServerPayload = z.infer<typeof ServerSchemaObj>

export const ServerSchema = toTypedSchema(ServerSchemaObj)

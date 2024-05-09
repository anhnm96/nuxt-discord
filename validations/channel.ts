import { ChannelType } from '@prisma/client'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

export const ChannelSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Channel name is required.',
    })
    .refine((name) => name !== 'general', {
      message: 'Channel name cannot be "general"',
    }),
  type: z.nativeEnum(ChannelType),
})

export type ChannelPayload = z.infer<typeof ChannelSchema>

export const TypedChannelSchema = toTypedSchema(ChannelSchema)

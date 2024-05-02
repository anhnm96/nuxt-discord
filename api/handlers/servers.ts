import type { Server } from '@prisma/client'
import type { ServerPayload } from '~/validations/server'

export function createServerHandler(payload: ServerPayload) {
  return useAPI<Server>('/servers', {
    method: 'POST',
    body: payload,
  })
}

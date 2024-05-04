import type { Server } from '@prisma/client'
import type { MemberWithProfile, ServerWithDetails } from '~/types'
import type { ServerPayload } from '~/validations/server'

export function createServerHandler(payload: ServerPayload) {
  return useAPI<Server>('/servers', {
    method: 'POST',
    body: payload,
  })
}

export function getUserServers() {
  return useNuxtApp().$api<Server[]>('/servers')
}

export function getServerMembers(id: string) {
  return useNuxtApp().$api<MemberWithProfile[]>(`/servers/${id}/members`)
}

export function getServerDetails(id: string) {
  return useNuxtApp().$api<ServerWithDetails>(`/servers/${id}`)
}

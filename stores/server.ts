import { useQuery } from '@tanstack/vue-query'
import type { Server } from '@prisma/client'
import { gKey, mKey } from '~/utils/queryKeys'
import {
  getServerDetails,
  getServerMembers,
  getUserServers,
} from '~/api/handlers/servers'

export function useGetServerList() {
  return useQuery({ queryKey: [gKey], queryFn: () => getUserServers() })
}

export function useGetCurrentServer(serverId: string) {
  const { data: servers } = useGetServerList()
  return computed(() => servers.value?.find((s: Server) => s.id === serverId))
}

export function useGetServerMembers(serverId: string) {
  const key = mKey(serverId)
  return useQuery({
    queryKey: [key],
    queryFn: () => getServerMembers(serverId),
  })
}

export function useGetServetDetails(serverId: string) {
  const key = cKey(serverId)
  return useQuery({
    queryKey: [key],
    queryFn: () => getServerDetails(serverId),
  })
}

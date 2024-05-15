import { useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Server } from '@prisma/client'
import {
  getServerDetails,
  getServerMembers,
  getUserServers,
} from '~/api/handlers/servers'

export const serversKey = 'servers'

export function useGetServerList() {
  return useQuery({ queryKey: [serversKey], queryFn: () => getUserServers() })
}

export function useGetCurrentServer(serverId: string) {
  const { data: servers } = useGetServerList()
  return computed(() => servers.value?.find((s: Server) => s.id === serverId))
}

export function useGetServerMembers(serverId: string) {
  return useQuery({
    queryKey: [serversKey, serverId, 'members'],
    queryFn: () => getServerMembers(serverId),
  })
}

export function useGetServerDetails(serverId: string) {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: [serversKey, serverId],
    queryFn: async () => {
      const data = await getServerDetails(serverId)
      data.categories.forEach((category) => {
        // queryClient.setQueryData(
        //   ['categories', category.id, 'channels'],
        //   category,
        // )
        category.channels.forEach((channel) => {
          queryClient.setQueryData([channelsKey, channel.id], channel)
        })
      })

      return data
    },
  })
}

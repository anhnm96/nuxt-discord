import { useQuery } from '@tanstack/vue-query'
import { mKey } from '~/utils/queryKeys'
import { getServerMembers } from '~/api/handlers/servers'

export function useGetServerMembers(serverId: string) {
  const key = mKey(serverId)
  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [key],
    queryFn: () => getServerMembers(serverId),
  })
}

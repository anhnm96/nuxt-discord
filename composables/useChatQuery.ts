import { useInfiniteQuery } from '@tanstack/vue-query'

interface ChatQueryProps {
  queryKey: string
  apiUrl: string
  paramKey: 'channelId' | 'conversationId'
  paramValue: string
}

export function useChatQuery({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: ChatQueryProps) {
  const { $api } = useNuxtApp()

  const fetchMessages = ({ pageParam }: any) => {
    return $api(`${apiUrl}?cursor=${pageParam}&${paramKey}=${paramValue}`)
  }

  return useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchMessages,
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => lastPage?.nextCursor,
  })
}

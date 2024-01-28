import { useInfiniteQuery } from '@tanstack/vue-query'
import type { MessageWithMember } from '@/types'

interface ChatQueryProps {
  queryKey: string
  apiUrl: string
  paramKey: 'channelId' | 'conversationId'
  paramValue: string
}

interface InfiniteMessage {
  items: MessageWithMember[]
  nextCursor: string
}

export function useChatQuery({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: ChatQueryProps) {
  const { $api } = useNuxtApp()

  const fetchMessages = ({ pageParam }: any): any => {
    return $api(`${apiUrl}?cursor=${pageParam}&${paramKey}=${paramValue}`)
  }

  return useInfiniteQuery<InfiniteMessage, Error>({
    queryKey: [queryKey],
    queryFn: fetchMessages,
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => lastPage?.nextCursor,
  })
}

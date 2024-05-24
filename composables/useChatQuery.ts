import { useInfiniteQuery } from '@tanstack/vue-query'
import type { MessageWithMember } from '@/types'
import { getMessages } from '~/handlers/messages'

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
  const fetchMessages = ({ pageParam }: any): any => {
    return getMessages(apiUrl, pageParam, paramKey, paramValue)
  }

  return useInfiniteQuery<InfiniteMessage, Error>({
    queryKey: [queryKey],
    queryFn: fetchMessages,
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => lastPage?.nextCursor,
  })
}

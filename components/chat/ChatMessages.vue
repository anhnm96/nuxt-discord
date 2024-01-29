<script setup lang="ts">
import { isSameHour } from 'date-fns'

defineProps<{
  type: string
}>()

const route = useRoute()
const serverId = route.params.sid as string
const chatId = route.params.cid as string

const queryKey = `chat:${chatId}`
const addKey = `chat:${chatId}:messages`
const updateKey = `chat:${chatId}:messages:update`
const deleteKey = `chat:${chatId}:messages:delete`

const {
  data: messages,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  status,
  suspense,
} = useChatQuery({
  queryKey,
  apiUrl: '/messages',
  paramKey: 'channelId',
  paramValue: chatId,
})

await suspense()

useChatSocket({ queryKey, addKey, updateKey, deleteKey })
// useChatScroll({
//   chatRef,
//   bottomRef,
//   loadMore: fetchNextPage,
//   shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
//   count: data?.pages?.[0]?.items?.length ?? 0,
// })
</script>

<template>
  <div class="flex">
    <div
      v-if="status === 'pending'"
      class="flex flex-1 flex-col items-center justify-center"
    >
      <Icon
        class="my-4 animate-spin text-zinc-500"
        size="28px"
        name="lucide:loader-2"
      />
      <p class="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
        Loading messages...
      </p>
    </div>
    <div
      v-if="status === 'error'"
      class="flex flex-1 flex-col items-center justify-center"
    >
      <Icon class="my-4 text-zinc-500" size="28px" name="lucide:server-crash" />
      <p class="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
        Something went wrong!
      </p>
    </div>
    <div
      v-if="status === 'success' && messages"
      class="mt-auto flex flex-1 flex-col-reverse"
    >
      <template v-for="(group, groupIndex) in messages.pages" :key="groupIndex">
        <ChatItem
          v-for="(message, i) in group.items"
          :key="message.id"
          :message="message"
          :show-header="
            i === group.items.length - 1 ||
            message.memberId !== group.items[i + 1].memberId ||
            !isSameHour(message.createdAt, group.items[i + 1].createdAt)
          "
          :url-query="`serverId=${serverId}&channelId=${chatId}`"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type: string
}>()

const route = useRoute()
const chatId = route.params.cid

const queryKey = `chat:${chatId}`
const addKey = `chat:${chatId}:messages`
const updateKey = `chat:${chatId}:messages:update`

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

useChatSocket({ queryKey, addKey, updateKey })
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
      v-if="status === 'loading'"
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
        <div v-for="(message, i) in group.items" :key="message.id">
          <div
            v-if="
              i === group.items.length - 1 ||
              message.memberId !== group.items[i + 1].memberId
            "
            class="mt-[17px] flex py-0.5 pl-4 pr-16 leading-[22px] hover:bg-gray-950/[.07]"
          >
            <AvatarRoot
              class="mr-4 mt-0.5 inline-flex h-10 w-10 select-none items-center justify-center rounded-full bg-gray-800"
            >
              <AvatarImage
                class="h-full w-full rounded-[inherit] object-cover"
                :src="message.member.profile.imageUrl"
                :alt="message.member.profile.username"
              />
              <AvatarFallback class="font-medium uppercase" :delay-ms="600">
                {{ message.member.profile.username.slice(0, 2) }}
              </AvatarFallback>
            </AvatarRoot>
            <div>
              <p class="flex items-baseline">
                <span class="mr-2 font-medium text-green-400">
                  {{ message.member.profile.username }}
                </span>
                <span class="text-xs font-medium text-gray-400">
                  {{ message.updatedAt }}
                </span>
              </p>
              <p class="text-gray-100">{{ message.content }}</p>
            </div>
          </div>
          <div
            v-else
            class="py-0.5 pl-4 pr-16 leading-[22px] hover:bg-gray-950/[.07]"
          >
            <p class="pl-14 text-gray-100">{{ message.content }}</p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})

const route = useRoute()
const { data: channel, suspense } = useGetCurrentChannel(
  route.params.cid as string,
)
await suspense()
</script>

<template>
  <div class="flex min-w-0 flex-1 flex-shrink flex-col bg-gray-700">
    <div v-if="channel" class="flex h-12 items-center px-2 shadow-md">
      <div class="flex items-center">
        <Icon
          class="mx-2 font-semibold text-gray-400"
          size="24px"
          name="mdi:hashtag"
        />
        <span class="mr-2 whitespace-nowrap font-title text-white">{{
          channel.name
        }}</span>
      </div>

      <template v-if="channel.description">
        <div class="mx-2 hidden h-6 w-px bg-white/[.06] md:block"></div>
        <div
          class="mx-2 hidden truncate text-sm font-medium text-gray-200 md:block"
        >
          {{ channel.description }}
        </div>
      </template>

      <!-- mobile buttons -->
      <div class="ml-auto flex items-center md:hidden">
        <button class="inline-flex text-gray-200 hover:text-gray-100">
          <Icon class="mx-2" size="24px" name="solar:hashtag-chat-bold" />
        </button>
        <button class="inline-flex text-gray-200 hover:text-gray-100">
          <Icon class="mx-2" size="24px" name="mdi:people" />
        </button>
      </div>
      <!-- desktop buttons -->
      <div class="ml-auto hidden items-center md:flex">
        <SocketIndicator />
        <button class="inline-flex text-gray-200 hover:text-gray-100">
          <Icon class="mx-2" size="24px" name="solar:hashtag-chat-bold" />
        </button>
        <button class="inline-flex text-gray-200 hover:text-gray-100">
          <Icon class="mx-2" size="24px" name="mdi:bell" />
        </button>
        <button class="inline-flex text-gray-200 hover:text-gray-100">
          <Icon class="mx-2" size="24px" name="tabler:pin-filled" />
        </button>
        <button class="inline-flex text-gray-200 hover:text-gray-100">
          <Icon class="mx-2" size="24px" name="mdi:people" />
        </button>
        <div class="relative mx-2">
          <input
            type="text"
            placeholder="Search"
            class="h-6 w-36 rounded border-none bg-gray-900 px-1.5 text-sm font-medium placeholder-gray-400"
          />
          <div class="absolute inset-y-0 right-0 flex items-center">
            <Icon class="mr-1.5 text-gray-400" name="carbon:search" />
          </div>
        </div>
        <button class="inline-flex text-gray-200 hover:text-gray-100">
          <Icon class="mx-2" size="24px" name="material-symbols:inbox" />
        </button>
        <button class="inline-flex text-gray-200 hover:text-gray-100">
          <Icon
            class="mx-2"
            size="24px"
            name="ant-design:question-circle-filled"
          />
        </button>
      </div>
    </div>
    <div class="flex flex-1">
      <div class="flex flex-1 flex-col">
        <ChatMessages
          v-if="channel"
          class="flex-1 overflow-y-auto"
          :channel="channel"
          type="channel"
        />
        <div class="relative mt-auto flex-shrink-0 px-4 py-6">
          <ChatInput />
        </div>
      </div>
      <MemberList v-if="channel" :channel-name="channel.name" />
    </div>
  </div>
</template>

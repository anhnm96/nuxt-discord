<script setup lang="ts">
import { data } from '@/data'
import type { Channel } from '@/types'

const route = useRoute()
const server = data[`${route.params.sid}`]
const selectedChannel = server.categories
  .map((c) => c.channels)
  .flat()
  .find((channel) => channel.id === route.params.cid) as Channel

const closedCategories = reactive(new Set<string>([]))
function toggleCategory(categoryId: string) {
  if (closedCategories.has(categoryId)) {
    closedCategories.delete(categoryId)
  } else {
    closedCategories.add(categoryId)
  }
}
</script>

<template>
  <div class="flex w-60 flex-col bg-gray-800">
    <button
      class="hover:bg-gray-550/[0.16] flex h-12 items-center px-4 font-title text-[15px] font-semibold text-white shadow-sm transition"
    >
      <div class="mr-2 flex items-center">
        <Icon size="16px" name="material-symbols:verified-rounded" />
      </div>
      Tailwind CSS
      <Icon class="ml-auto" size="18px" name="carbon:chevron-down" />
    </button>
    <!-- channel list -->
    <div
      class="flex-1 space-y-[21px] overflow-y-scroll pt-3 font-medium text-gray-300"
    >
      <div v-for="category in data['1'].categories" :key="category.id">
        <button
          v-if="category.label"
          class="flex w-full items-center px-0.5 font-title text-xs uppercase tracking-wide hover:text-gray-100"
          @click="toggleCategory(category.id)"
        >
          <Icon
            :class="[closedCategories.has(category.id) && '-rotate-90']"
            class="mr-0.5 transition duration-200"
            size="12px"
            name="carbon:chevron-down"
          />
          {{ category.label }}
        </button>

        <div class="mt-[5px] space-y-0.5">
          <NuxtLink
            v-for="channel in category.channels.filter((c) => {
              const categoryIsOpen = !closedCategories.has(category.id)

              return categoryIsOpen || c.unread
            })"
            :key="channel.id"
            v-slot="{ isActive, href }"
            :to="`/channels/${$route.params.sid}/${channel.id}`"
            custom
          >
            <a
              :href="href"
              :class="[
                isActive
                  ? 'bg-gray-550/[0.32] text-white'
                  : channel.unread
                    ? 'hover:bg-gray-550/[0.16] active:bg-gray-550/[0.24] text-white'
                    : 'hover:bg-gray-550/[0.16] active:bg-gray-550/[0.24] text-gray-300 hover:text-gray-100',
              ]"
              class="group relative mx-2 flex items-center rounded px-2 py-1"
            >
              <div
                v-if="!isActive && channel.unread"
                class="absolute left-0 -ml-2 h-2 w-1 rounded-r-full bg-white"
              ></div>
              <Icon
                class="mr-1.5 text-gray-400"
                size="20px"
                :name="channel.icon || 'mdi:hashtag'"
              />
              {{ channel.label }}
              <Icon
                class="ml-auto text-gray-200 opacity-0 hover:text-gray-100 group-hover:opacity-100"
                size="16px"
                name="material-symbols:person-add"
              />
            </a>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>

  <div class="flex min-w-0 flex-1 flex-shrink flex-col bg-gray-700">
    <div class="flex h-12 items-center px-2 shadow-sm">
      <div class="flex items-center">
        <Icon
          class="mx-2 font-semibold text-gray-400"
          size="24px"
          name="mdi:hashtag"
        />
        <span class="mr-2 font-title text-white">{{
          selectedChannel.label
        }}</span>
      </div>

      <template v-if="selectedChannel.description">
        <div class="mx-2 h-6 w-px bg-white/[.06]"></div>
        <div class="mx-2 truncate text-sm font-medium text-gray-200">
          {{ selectedChannel.description }}
        </div>
      </template>

      <div class="ml-auto flex items-center">
        <button class="text-gray-200 hover:text-gray-100">
          <Icon class="mx-2" size="24px" name="solar:hashtag-chat-bold" />
        </button>
        <button class="text-gray-200 hover:text-gray-100">
          <Icon class="mx-2" size="24px" name="mdi:bell" />
        </button>
        <button class="text-gray-200 hover:text-gray-100">
          <Icon class="mx-2" size="24px" name="tabler:pin-filled" />
        </button>
        <button class="text-gray-200 hover:text-gray-100">
          <Icon class="mx-2" size="24px" name="mdi:people" />
        </button>
        <button class="text-gray-200 hover:text-gray-100">
          <Icon class="mx-2" size="24px" name="material-symbols:inbox" />
        </button>
        <button class="text-gray-200 hover:text-gray-100">
          <Icon
            class="mx-2"
            size="24px"
            name="ant-design:question-circle-filled"
          />
        </button>
      </div>
    </div>
    <div class="flex-1 space-y-4 overflow-y-scroll p-3">
      <p v-for="(_, i) in [...Array(40)]" :key="i">
        Message {{ i }}. Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Vel saepe laudantium sed reprehenderit incidunt! Hic rem quos
        reiciendis, fugit quae ratione beatae veniam laborum voluptatem, iusto
        dolorum, voluptates suscipit quia.
      </p>
    </div>
  </div>
</template>

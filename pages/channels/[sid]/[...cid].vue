<script setup lang="ts">
import { data } from '@/data'
import type { Channel, Server } from '@/types'

definePageMeta({
  middleware: ['auth'],
})

const route = useRoute()
const server = data.find((s) => s.id === route.params.sid) as Server
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
  <div class="hidden w-60 flex-col bg-gray-800 md:flex">
    <button
      class="flex h-12 items-center px-4 font-title text-[15px] font-semibold text-white shadow-sm transition hover:bg-gray-550/[0.16]"
    >
      <div class="mr-2 flex items-center">
        <Icon size="16px" name="material-symbols:verified-rounded" />
      </div>
      {{ server.label }}
      <Icon class="ml-auto" size="18px" name="carbon:chevron-down" />
    </button>
    <!-- channel list -->
    <div
      class="flex-1 space-y-[21px] overflow-y-auto pt-3 font-medium text-gray-300"
    >
      <div v-for="category in server.categories" :key="category.id">
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
                    ? 'text-white hover:bg-gray-550/[0.16] active:bg-gray-550/[0.24]'
                    : 'text-gray-300 hover:bg-gray-550/[0.16] hover:text-gray-100 active:bg-gray-550/[0.24]',
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
        <span class="mr-2 whitespace-nowrap font-title text-white">{{
          selectedChannel.label
        }}</span>
      </div>

      <template v-if="selectedChannel.description">
        <div class="bg-white/[.06 mx-2 hidden h-6 w-px md:block"></div>
        <div
          class="mx-2 hidden truncate text-sm font-medium text-gray-200 md:block"
        >
          {{ selectedChannel.description }}
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
    <div class="flex-1 overflow-y-auto">
      <div v-for="(message, i) in selectedChannel.messages" :key="message.id">
        <div
          v-if="
            i === 0 || message.user !== selectedChannel.messages[i - 1].user
          "
          class="mt-[17px] flex py-0.5 pl-4 pr-16 leading-[22px] hover:bg-gray-950/[.07]"
        >
          <img
            class="mr-4 mt-0.5 h-10 w-10 rounded-full"
            :src="message.avatarUrl"
            alt=""
          />
          <div>
            <p class="flex items-baseline">
              <span class="mr-2 font-medium text-green-400">
                {{ message.user }}
              </span>
              <span class="text-xs font-medium text-gray-400">
                {{ message.date }}
              </span>
            </p>
            <p class="text-gray-100">{{ message.text }}</p>
          </div>
        </div>
        <div
          v-else
          class="py-0.5 pl-4 pr-16 leading-[22px] hover:bg-gray-950/[.07]"
        >
          <p class="pl-14 text-gray-100">{{ message.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

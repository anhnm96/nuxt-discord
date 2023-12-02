<script setup lang="ts">
interface Server {
  id: string | number
  label: string
  categories: Category[]
}

interface Category {
  id: string | number
  label: string
  channels: Channel[]
}

interface Channel {
  id: string | number
  label: string
  icon?: string
  unread?: boolean
}
const data: Record<string, Server> = {
  '1': {
    id: 1,
    label: 'Tailwind CSS',
    categories: [
      {
        id: 1,
        label: '',
        channels: [
          { id: 1, label: 'welcome', icon: 'ic:baseline-library-books' },
          {
            id: 2,
            label: 'announcements',
            icon: 'heroicons-solid:speakerphone',
          },
        ],
      },
      {
        id: 2,
        label: 'Tailwind CSS',
        channels: [
          { id: 3, label: 'general', unread: true },
          { id: 4, label: 'plugins', unread: true },
          { id: 5, label: 'help', unread: true },
          { id: 6, label: 'internals' },
        ],
      },
      {
        id: 3,
        label: 'Tailwind Labs',
        channels: [
          { id: 7, label: 'tailwind-ui' },
          { id: 8, label: 'headless-ui' },
          { id: 9, label: 'refactoring-ui', unread: true },
          { id: 10, label: 'heroicons', unread: true },
        ],
      },
      {
        id: 4,
        label: 'Off topic',
        channels: [
          { id: 11, label: 'design' },
          { id: 12, label: 'development' },
          { id: 13, label: 'random', unread: true },
        ],
      },
      {
        id: 5,
        label: 'Community',
        channels: [
          { id: 14, label: 'jobs' },
          { id: 15, label: 'showcase', unread: true },
          { id: 16, label: 'bots' },
        ],
      },
    ],
  },
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
        >
          <Icon class="mr-0.5" size="12px" name="carbon:chevron-down" />
          {{ category.label }}
        </button>

        <div class="mt-[5px] space-y-0.5">
          <NuxtLink
            v-for="channel in category.channels"
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

  <div class="flex flex-1 flex-col bg-gray-700">
    <div class="flex h-12 items-center px-3 shadow-sm">general</div>
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

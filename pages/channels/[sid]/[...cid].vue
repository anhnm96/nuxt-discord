<script setup lang="ts">
import { ChannelType, MemberRole } from '@prisma/client'
import type { Category, Channel, Member, Server } from '@prisma/client'
import { useModalStore } from '~/stores/modal'

definePageMeta({
  middleware: ['auth'],
})

interface ServerWithDetails extends Server {
  categories: (Category & { channels: Channel[] })[]
  members: Member[]
}

const route = useRoute()
const { data: server, status } = await useAPI<ServerWithDetails>(
  `/servers/${route.params.sid}`,
  { key: `server-${route.params.sid}` },
)
if (!server.value)
  throw createError({ statusCode: 404, statusMessage: 'Server Not Found' })

// const textChannels = server.value?.channels.filter(
//   (channel) => channel.type === ChannelType.TEXT,
// )
// const audioChannels = server.value?.channels.filter(
//   (channel) => channel.type === ChannelType.AUDIO,
// )
// const videoChannels = server.value?.channels.filter(
//   (channel) => channel.type === ChannelType.VIDEO,
// )
// const members = server.value?.members.filter(
//   (member) => member.profileId !== profile.id,
// )
const selectedChannel = server.value.categories[1].channels[0]

const closedCategories = reactive(new Set<string>([]))
function toggleCategory(categoryId: string) {
  if (closedCategories.has(categoryId)) {
    closedCategories.delete(categoryId)
  } else {
    closedCategories.add(categoryId)
  }
}

const { $api } = useNuxtApp()
const { user } = storeToRefs(useAuthStore())
const role = server.value.members.find(
  (member) => member.profileId === user.value!.id,
)?.role
const isAdmin = role === MemberRole.ADMIN
const isModerator = isAdmin || role === MemberRole.MODERATOR

const { open } = useDialog()
async function deleteServer() {
  const answer = await open({
    title: `Delete server "${server.value?.name}"`,
    content: `Are you sure you want to delete "${server.value?.name}"? This action cannot be undone.`,
    okText: 'Delete Server',
  })
  if (answer === 'confirm') {
    await $api(`servers/${server.value?.id}`, { method: 'DELETE' })
    refreshNuxtData('servers')
    navigateTo('/')
  }
}

async function leaveServer() {
  const answer = await open({
    title: `Leave "${server.value?.name}"`,
    content: `Are you sure you want to leave "${server.value?.name}"? You won't be able to re-join this server unless you are re-invited.`,
    okText: 'Leave Server',
  })
  if (answer === 'confirm') {
    await $api(`servers/${server.value?.id}/leave`, { method: 'PATCH' })
    refreshNuxtData('servers')
    navigateTo('/')
  }
}
const modalStore = useModalStore()
const dropdownMenu = [
  {
    show: isModerator,
    component: resolveComponent('InviteModal'),
    label: 'Invite People',
    icon: 'material-symbols:person-add',
  },
  {
    show: isAdmin,
    component: resolveComponent('ServerSettingsModal'),
    label: 'Server Settings',
    icon: 'lucide:settings',
  },
  {
    show: isAdmin,
    component: resolveComponent('MembersModal'),
    label: 'Manage Members',
    icon: 'lucide:users',
  },
  {
    show: isModerator,
    label: 'Create Channel',
    icon: 'lucide:plus-circle',
    click: () =>
      modalStore.open('createChannel', {
        categoryId: server.value!.categories[0].id,
      }),
  },
  {
    show: isAdmin,
    component: '',
    label: 'Delete Server',
    icon: 'lucide:trash',
    click: () => deleteServer(),
  },
  {
    show: !isAdmin,
    component: '',
    label: 'Leave Settings',
    icon: 'lucide:log-out',
    click: () => leaveServer(),
  },
]

const iconMap = {
  [ChannelType.TEXT]: 'lucide:hash',
  [ChannelType.AUDIO]: 'lucide:mic',
  [ChannelType.VIDEO]: 'lucide:video',
}
</script>

<template>
  <div class="hidden w-60 flex-col bg-gray-800 md:flex">
    <DropdownMenuRoot>
      <DropdownMenuTrigger
        class="flex h-12 items-center px-4 font-title text-[15px] font-semibold text-white shadow-sm transition hover:bg-gray-550/[0.16]"
      >
        <div class="mr-2 flex items-center">
          <Icon size="16px" name="material-symbols:verified-rounded" />
        </div>
        {{ server?.name }}
        <Icon class="ml-auto" size="18px" name="carbon:chevron-down" />
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent
          class="min-w-[220px] rounded bg-black px-2 py-1.5 text-gray-100"
        >
          <template v-for="(menu, index) in dropdownMenu" :key="menu.label">
            <DropdownMenuSeparator
              v-if="index === 4 && isModerator"
              class="my-1 h-px bg-gray-800"
            />
            <template v-if="menu.show">
              <ClientOnly v-if="menu.component">
                <DropdownMenuItem :as="menu.component">
                  <div
                    class="flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 hover:bg-brand-560 hover:text-white"
                  >
                    <span>{{ menu.label }}</span>
                    <Icon :name="menu.icon" />
                  </div>
                </DropdownMenuItem>
              </ClientOnly>
              <DropdownMenuItem
                v-else
                class="flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 hover:bg-brand-560 hover:text-white"
                @click="menu.click"
              >
                <span>{{ menu.label }}</span>
                <Icon :name="menu.icon" />
              </DropdownMenuItem>
            </template>
          </template>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
    <!-- channel list -->
    <div
      class="flex-1 space-y-4 overflow-y-auto pt-3 font-medium text-gray-300"
    >
      <template v-if="server">
        <div v-for="category in server.categories" :key="category.id">
          <div
            v-if="category.name"
            class="flex items-center justify-between pr-2"
          >
            <button
              class="flex w-full items-center px-0.5 font-title text-xs uppercase tracking-wide hover:text-gray-100"
              @click="toggleCategory(category.id)"
            >
              <Icon
                :class="[closedCategories.has(category.id) && '-rotate-90']"
                class="mr-0.5 transition duration-200"
                size="12px"
                name="carbon:chevron-down"
              />
              {{ category.name }}
            </button>
            <button
              class="hover:text-gray-100"
              aria-label="Create Channel"
              @click="
                modalStore.open('createChannel', {
                  category,
                })
              "
            >
              <Icon size="18px" name="lucide:plus" />
            </button>
          </div>

          <div class="mt-1 space-y-0.5">
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
                  :name="iconMap[channel.type]"
                />
                {{ channel.name }}
                <div class="ml-auto space-x-1">
                  <button
                    aria-label="Edit Channel"
                    class="text-gray-200 opacity-0 hover:text-gray-100 group-hover:opacity-100"
                    @click.prevent="
                      modalStore.open('editChannel', {
                        category,
                        channel,
                      })
                    "
                  >
                    <Icon size="16px" name="lucide:edit" />
                  </button>
                  <button
                    aria-label="Delete Channel"
                    class="text-gray-200 opacity-0 hover:text-gray-100 group-hover:opacity-100"
                  >
                    <Icon size="16px" name="lucide:trash" />
                  </button>
                </div>
              </a>
            </NuxtLink>
          </div>
        </div>
      </template>
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
          selectedChannel.name
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

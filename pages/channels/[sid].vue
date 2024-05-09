<script setup lang="ts">
import type { Channel } from '@prisma/client'
import { ChannelType } from '@prisma/client'
import type { CategoryWithChannels } from '@/types'
import { useGetServetDetails } from '~/stores/server'
import useChannelSocket from '~/api/ws/useChannelSocket'

definePageMeta({
  middleware: ['auth'],
  pageTransition: false,
})

const route = useRoute()

const serverId = route.params.sid as string
const { data: server, suspense } = useGetServetDetails(serverId)
await suspense()
useChannelSocket(serverId, cKey(serverId))

if (!server.value)
  throw createError({ statusCode: 404, statusMessage: 'Server Not Found' })

if (!route.params.cid) {
  const defaultChannel = server.value.categories[0].channels[0]

  navigateTo(`/channels/${route.params.sid}/${defaultChannel.id}`, {
    replace: true,
  })
}

const closedCategories = reactive(new Set<string>([]))
function toggleCategory(categoryId: string) {
  if (closedCategories.has(categoryId)) {
    closedCategories.delete(categoryId)
  } else {
    closedCategories.add(categoryId)
  }
}

// set current member
const { user } = storeToRefs(useAuthStore())
const channelStore = useChannelStore()
const foundMember = server.value.members.find(
  (member) => member.profileId === user.value!.id,
)
if (foundMember) channelStore.setCurrentMember(foundMember)

const { $api } = useNuxtApp()
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

async function deleteChannel(category: CategoryWithChannels, channel: Channel) {
  const answer = await open({
    title: `Delete Channel`,
    content: `Are you sure you want to delete "#${channel.name}"? This cannot be undone.`,
    okText: 'Delete Channel',
  })
  if (answer === 'confirm') {
    await $api(
      `/channels/${channel.id}?serverId=${server.value?.id}&categoryId=${category.id}`,
      { method: 'DELETE' },
    )
    refreshNuxtData(`server-${server.value?.id}`)
    if (route.params.cid[0] === channel.id) {
      if (category.channels.length > 1) {
        const c = category.channels.find((c) => c.id !== channel.id)
        if (c)
          navigateTo(`/channels/${server.value?.id}/${c.id}`, { replace: true })
      } else {
        navigateTo(
          `/channels/${server.value?.id}/${server.value?.categories[1].channels[0].id}`,
          { replace: true },
        )
      }
    }
  }
}

const modalStore = useModalStore()
const dropdownMenu = [
  {
    show: channelStore.isModerator,
    component: resolveComponent('InviteModal'),
    label: 'Invite People',
    icon: 'material-symbols:person-add',
  },
  {
    show: channelStore.isAdmin,
    component: resolveComponent('ServerSettingsModal'),
    label: 'Server Settings',
    icon: 'lucide:settings',
  },
  {
    show: channelStore.isAdmin,
    component: resolveComponent('MembersModal'),
    label: 'Manage Members',
    icon: 'lucide:users',
  },
  {
    show: channelStore.isModerator,
    label: 'Create Channel',
    icon: 'lucide:plus-circle',
    click: () =>
      modalStore.open('createChannel', {
        category: server.value!.categories[0],
      }),
  },
  {
    show: channelStore.isAdmin,
    component: '',
    label: 'Delete Server',
    icon: 'lucide:trash',
    click: () => deleteServer(),
  },
  {
    show: !channelStore.isAdmin,
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
              v-if="index === 4 && channelStore.isModerator"
              class="my-1 h-px bg-gray-800"
            />
            <template v-if="menu.show">
              <ClientOnly v-if="menu.component">
                <!-- <DropdownMenuItem> -->
                <component :is="menu.component">
                  <div
                    class="flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 hover:bg-brand-560 hover:text-white"
                  >
                    <span>{{ menu.label }}</span>
                    <Icon :name="menu.icon" />
                  </div>
                </component>
                <!-- </DropdownMenuItem> -->
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
              v-slot="{ isActive, href, navigateTo }"
              :to="`/channels/${$route.params.sid}/${channel.id}`"
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
                @click="navigateTo"
              >
                <div
                  v-if="!isActive && channel.unread"
                  class="absolute left-0 -ml-2 h-2 w-1 rounded-r-full bg-white"
                ></div>
                <Icon
                  class="mr-1.5 text-gray-400"
                  size="20px"
                  :name="iconMap[channel.type as keyof typeof iconMap]"
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
                    @click.prevent="deleteChannel(category, channel)"
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
    <UserPanel />
  </div>
  <ClientOnly>
    <NuxtPage />
  </ClientOnly>
</template>

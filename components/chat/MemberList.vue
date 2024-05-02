<script setup lang="ts">
import type { MemberWithProfile } from '~/types'

defineProps<{
  channelName: string
}>()

const route = useRoute()
const serverId = route.params.sid as string
const { data: members, suspense } = useGetServerMembers(serverId)
await suspense()

const online = computed(
  () =>
    members.value?.filter(
      (member: MemberWithProfile) => member.profile.isOnline,
    ),
)
const offline = computed(
  () =>
    members.value?.filter(
      (member: MemberWithProfile) => !member.profile.isOnline,
    ),
)
</script>

<template>
  <aside
    class="w-60 flex-shrink-0 bg-gray-800 pb-4"
    :aria-label="`Members list for ${channelName} (channel)`"
  >
    <div class="h-full overflow-y-auto">
      <div role="list" aria-label="Members" class="space-y-1 pl-4 pr-2 pt-6">
        <h2
          class="px-2 text-xs font-semibold uppercase"
          :aria-label="`Online, ${online?.length} member`"
        >
          <span aria-hidden="true">Online — {{ online?.length }}</span>
        </h2>
        <div v-for="member in online" :key="member.id" role="listitem">
          <div
            class="flex items-center space-x-2 rounded px-2 py-1 hover:bg-modifier-hover hover:text-white"
          >
            <BaseAvatar
              :img="member.profile.imageUrl || ''"
              :is-online="member.profile.isOnline"
              :username="member.profile.username || ''"
            />
            <div>
              <span>{{ member.profile.username }}</span>
            </div>
          </div>
        </div>
        <!-- offline -->
        <h2
          class="px-2 text-xs font-semibold uppercase"
          :aria-label="`Offline, ${offline?.length} member`"
        >
          <span aria-hidden="true">Offline — {{ offline?.length }}</span>
        </h2>
        <div v-for="member in offline" :key="member.id" role="listitem">
          <div
            class="flex items-center space-x-2 rounded px-2 py-1 hover:bg-modifier-hover hover:text-white"
          >
            <BaseAvatar
              :img="member.profile.imageUrl || ''"
              :is-online="member.profile.isOnline"
              :username="member.profile.username || ''"
            />
            <div>
              <span>{{ member.profile.username }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { Server } from '@prisma/client'

const { data: servers } = useAPI<Server[]>('/servers')

function getServerName(name: string) {
  const nameArr = name.split(' ').slice(0, 2)

  return nameArr[0][0] + nameArr[1]?.[0]
}
</script>

<template>
  <div class="hidden space-y-2 overflow-y-scroll bg-gray-900 p-3 md:block">
    <NavLink to="/">
      <Icon size="30px" name="ic:baseline-discord" />
    </NavLink>
    <hr class="mx-2 rounded border-t-2 border-t-white/[.06]" />
    <template v-if="servers">
      <NavLink
        v-for="server in servers"
        :key="server.id"
        :to="`/channels/${server.id}/`"
      >
        <img
          v-if="server.imageUrl"
          :src="`/servers/${server.imageUrl}`"
          alt=""
        />
        <template v-else>
          {{ getServerName(server.name) }}
        </template>
      </NavLink>
    </template>

    <CreateServerModal />
  </div>
</template>

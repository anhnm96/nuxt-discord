<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query'
import { joinServer } from '~/handlers/servers'

definePageMeta({
  middleware: ['auth'],
})

const route = useRoute()
const inviteCode = route.params.inviteCode as string
const queryClient = useQueryClient()

onMounted(async () => {
  try {
    const { serverId } = await joinServer(inviteCode)
    queryClient.invalidateQueries({ queryKey: [serversKey] })
    if (serverId) navigateTo(`/channels/${serverId}`, { replace: true })
    else navigateTo('/', { replace: true })
  } catch (err) {
    navigateTo('/', { replace: true })
  }
})
</script>

<template>
  <div
    class="grid h-screen min-w-0 flex-1 flex-shrink place-items-center bg-gray-700"
  >
    <video autoplay loop>
      <source src="~/assets/loading.webm" type="video/webm" />
    </video>
  </div>
</template>

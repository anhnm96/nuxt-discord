<script setup lang="ts">
import type { ServerWithDetails } from '@/types'

definePageMeta({
  middleware: ['auth'],
})

const route = useRoute()
const { data: server, status } = await useAPI<ServerWithDetails>(
  `/servers/${route.params.sid}`,
  { key: `server-${route.params.sid}` },
)
if (!server.value)
  throw createError({ statusCode: 404, statusMessage: 'Server Not Found' })

navigateTo(
  `/channels/${route.params.sid}/${server.value.categories[1].channels[0].id}`,
  { replace: true },
)
</script>

<template>
  <slot />
</template>

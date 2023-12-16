<script setup lang="ts">
import { data } from '@/data'

const authStore = useAuthStore()
if (process.client) {
  const user = localStorage.getItem('user')
  const expiresAt = localStorage.getItem('expiresAt')
  if (!authStore.user && expiresAt && Date.now() < Number(expiresAt) && user) {
    authStore.user = JSON.parse(user)
  }
}

useHead({
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: '',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=NotoOpen+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap',
    },
  ],
})
</script>

<template>
  <div class="flex h-screen text-gray-100">
    <div class="hidden space-y-2 overflow-y-scroll bg-gray-900 p-3 md:block">
      <NavLink to="/">
        <Icon size="30px" name="ic:baseline-discord" />
      </NavLink>
      <hr class="mx-2 rounded border-t-2 border-t-white/[.06]" />
      <NavLink
        v-for="server in data"
        :key="server.id"
        :to="`/channels/${server.id}/${server.categories[0].channels[0].id}`"
      >
        <img :src="`/servers/${server.img}`" alt="" />
      </NavLink>
      <CreateServerModal />
    </div>
    <NuxtPage />
  </div>
</template>

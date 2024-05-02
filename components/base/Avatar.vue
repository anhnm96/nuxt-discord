<script setup lang="ts">
withDefaults(
  defineProps<{
    img?: string
    isOnline: boolean
    username?: string
  }>(),
  { img: '', username: '' },
)
</script>

<template>
  <div class="relative">
    <img
      class="h-8 w-8 rounded-full"
      :src="img"
      :alt="`${username}, ${isOnline ? 'Online' : 'Offline'}`"
    />
    <div
      class="bg-primary absolute -bottom-1/4 -right-1/4 grid h-4 w-4 -translate-x-1/3 -translate-y-1/3 place-items-center rounded-full"
    >
      <div v-if="isOnline" class="h-2.5 w-2.5 rounded-full bg-green-500"></div>
      <div
        v-else
        class="grid h-2.5 w-2.5 place-items-center rounded-full bg-gray-400"
      >
        <div class="h-1.5 w-1.5 rounded-full bg-gray-700"></div>
      </div>
    </div>
  </div>
</template>

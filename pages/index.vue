<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  pageTransition: false,
})
</script>

<template>
  <div class="flex w-60 flex-col bg-gray-800">
    <div
      class="flex h-12 items-center px-3 font-title font-semibold text-white shadow-md"
    >
      Dashboard
    </div>
    <div class="flex-1 space-y-2 overflow-y-auto p-3 font-medium text-gray-300">
      <p class="text-white">Friends</p>
    </div>
  </div>

  <div class="flex flex-1 flex-col bg-gray-700"></div>
</template>

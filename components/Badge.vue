<script lang="ts" setup>
defineProps<{
  icon?: boolean
  actionLabel?: string
}>()

defineEmits(['close'])
</script>

<template>
  <span class="badge" :class="[icon && 'badge-icon']">
    <slot />
    <button
      v-if="icon"
      class="ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full"
      @click="$emit('close')"
    >
      <span v-if="actionLabel" class="sr-only">{{ actionLabel }}</span>
      <svg class="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
        <path stroke-linecap="round" stroke-width="1.5" d="M1 1l6 6m0-6L1 7" />
      </svg>
    </button>
  </span>
</template>

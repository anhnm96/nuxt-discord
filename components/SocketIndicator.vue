<script setup lang="ts">
const { isConnected } = useSocket()
</script>

<template>
  <Badge :class="[isConnected ? 'badge-success' : 'badge-warning']">
    {{ isConnected ? 'Live: Real-time updates' : 'Fallback: Polling every 1s' }}
  </Badge>
</template>

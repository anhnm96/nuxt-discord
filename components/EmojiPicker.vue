<script setup lang="ts">
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'

const emit = defineEmits(['select'])

const open = ref(false)
function select(emoji: any) {
  open.value = false
  emit('select', emoji.i)
}
</script>

<template>
  <PopoverRoot v-model:open="open">
    <PopoverTrigger class="inline-flex">
      <Icon
        size="24px"
        class="text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
        name="lucide:smile"
      />
    </PopoverTrigger>
    <PopoverContent
      side="right"
      :side-offset="-40"
      class="mb-16 border-none bg-transparent shadow-none drop-shadow-none"
    >
      <!-- <Picker :data="emojiIndex" @select="select" /> -->
      <EmojiPicker :native="true" theme="dark" @select="select" />
    </PopoverContent>
  </PopoverRoot>
</template>

<style>
.emoji-mart {
  color: #fff;
  background-color: theme(colors.gray.800);
  border-color: theme(colors.gray.800);
}

.emoji-mart .emoji-mart-search input {
  background-color: theme(colors.gray.700);
  color: #fff;
}

.emoji-mart .emoji-mart-search-icon svg {
  fill: #fff;
}

.emoji-mart .emoji-mart-category .emoji-mart-emoji:hover:before {
  background-color: #444;
}

.emoji-mart .emoji-mart-category-label h3 {
  background-color: transparent;
  color: theme(colors.gray.300);
}
</style>

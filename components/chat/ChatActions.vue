<script setup lang="ts">
import type { MessageWithMember } from '@/types'

const props = defineProps<{ message: MessageWithMember }>()
const emit = defineEmits(['edit', 'delete'])
const channelStore = useChannelStore()
const isOwner = computed(
  () => channelStore.currentMember?.id === props.message.member.id,
)
const canDeleteMessage = computed(
  () =>
    !props.message.deleted &&
    (channelStore.isAdmin || channelStore.isModerator || isOwner.value),
)
const canEditMessage = computed(
  () => !props.message.deleted && isOwner.value && !props.message.fileUrl,
)

const open = ref(false)
function handleDelete() {
  emit('delete')
  open.value = false
}
</script>

<template>
  <div class="pr-18 absolute -top-6 right-0 z-10 hidden pl-8 group-hover:block">
    <div class="flex rounded bg-gray-800">
      <button
        v-if="canEditMessage"
        class="grid h-8 w-8 place-items-center hover:bg-modifier-hover hover:text-hover"
        @click="$emit('edit')"
      >
        <Icon name="lucide:pencil" />
      </button>
      <button
        v-if="canDeleteMessage"
        class="grid h-8 w-8 place-items-center hover:bg-modifier-hover hover:text-hover"
        @click="open = true"
      >
        <Icon name="lucide:trash" />
      </button>
    </div>
    <DeleteMessageModal
      v-if="open"
      :message="message"
      @cancel="open = false"
      @delete="handleDelete"
    />
  </div>
</template>

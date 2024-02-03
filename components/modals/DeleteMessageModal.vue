<script setup lang="ts">
import type { MessageWithMember } from '@/types'

defineProps<{
  message: MessageWithMember
}>()

const emit = defineEmits(['delete', 'cancel'])
function deleteMessage() {
  emit('delete')
}
</script>

<template>
  <DialogRoot>
    <DialogPortal>
      <Transition :duration="200">
        <div>
          <Transition name="fade">
            <DialogOverlay class="fixed inset-0 bg-black/70" />
          </Transition>
          <Transition name="modal">
            <DialogContent
              class="fixed left-1/2 top-1/2 z-50 origin-top-left -translate-x-1/2 -translate-y-1/2"
            >
              <div
                class="mx-auto w-screen max-w-md space-y-4 overflow-hidden rounded bg-gray-700 pt-4 text-hover"
              >
                <header class="flex items-center justify-start px-6">
                  <DialogTitle class="text-xl font-bold"
                    >Delete Message</DialogTitle
                  >
                </header>
                <main class="space-y-4 px-6">
                  <p>Are you sure you want to delete this message?</p>
                  <div class="rounded py-2.5 shadow-msg">
                    <div class="pl-18 relative flex items-center px-4">
                      <AvatarRoot
                        class="mr-4 inline-flex h-10 w-10 select-none items-center justify-center rounded-full bg-gray-800"
                      >
                        <AvatarImage
                          v-if="message.member.profile.imageUrl"
                          class="h-full w-full rounded-[inherit] object-cover"
                          :src="message.member.profile.imageUrl"
                          :alt="message.member.profile.username"
                        />
                        <AvatarFallback
                          class="font-medium uppercase"
                          :delay-ms="600"
                        >
                          {{ message.member.profile.username?.slice(0, 2) }}
                        </AvatarFallback>
                      </AvatarRoot>
                      <div>
                        <h2 class="space-x-2 font-medium">
                          <span class="text-white">{{
                            message.member.profile.username
                          }}</span>
                          <time
                            :datetime="message.createdAt.toString()"
                            class="text-xs text-muted"
                            >{{ getTime(message.createdAt.toString()) }}</time
                          >
                        </h2>
                        <p>
                          {{ message.content }}
                        </p>
                      </div>
                    </div>
                  </div>
                </main>
                <footer class="bg-[#2f3136] px-6 py-4">
                  <div class="flex justify-between space-x-2">
                    <button
                      type="button"
                      class="rounded bg-transparent px-4 py-2 text-sm text-white hover:underline"
                      @click="$emit('cancel')"
                    >
                      Cancel
                    </button>
                    <button
                      class="rounded bg-red-500 px-4 py-2 text-sm text-white transition hover:bg-red-600"
                      @click="deleteMessage"
                    >
                      Delete
                    </button>
                  </div>
                </footer>
              </div>
            </DialogContent>
          </Transition>
        </div>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import type { Server } from '@prisma/client'

const route = useRoute()
const { data: server } = useNuxtData(`server-${route.params.sid}`)
const inviteUrl = ref(
  `${window.location.origin}/invite/${server.value.inviteCode}`,
)
const { copy, copied } = useClipboard({ source: inviteUrl })

const { $api } = useNuxtApp()
const loading = ref(false)
async function generateInviteUrl() {
  try {
    loading.value = true
    const updatedServer = await $api<Server>(
      `/servers/${route.params.sid}/invite-code`,
      { method: 'PATCH' },
    )
    inviteUrl.value = `${window.location.origin}/invite/${updatedServer.inviteCode}`
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <DialogRoot>
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
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
                class="mx-auto w-screen max-w-md overflow-hidden rounded bg-gray-700 text-gray-200"
              >
                <section class="relative border-b border-black p-4">
                  <DialogClose
                    class="absolute right-4 top-4 grid h-8 w-8 place-items-center text-gray-300 transition-colors hover:text-gray-200"
                    aria-label="close"
                  >
                    <Icon name="lucide:x" size="20px" />
                  </DialogClose>
                  <DialogTitle class="text-xl font-bold text-gray-200"
                    >Invite friends to {{ server?.name }}</DialogTitle
                  >
                  <p class="flex items-center space-x-2">
                    <Icon class="mt-1" size="20px" name="mdi:hashtag" />
                    <span>general</span>
                  </p>
                </section>
                <section class="space-y-2 p-4">
                  <p class="text-xs font-bold uppercase">
                    Or send a server invite link to a friend
                  </p>
                  <div class="relative flex-auto rounded">
                    <input
                      class="w-full bg-gray-900 py-2.5 pl-4 pr-16 outline-none"
                      type="text"
                      :value="inviteUrl"
                      disabled
                    />
                    <div class="absolute right-1 top-1/2">
                      <BaseButton
                        type="button"
                        class="-translate-y-1/2 rounded px-4 py-1 font-medium text-white transition"
                        :class="[
                          copied
                            ? 'bg-green-500'
                            : 'bg-brand hover:bg-brand-560 active:bg-brand-600',
                        ]"
                        @click="copy()"
                      >
                        {{ copied ? 'Copied' : 'Copy' }}
                      </BaseButton>
                    </div>
                  </div>
                  <p class="text-xs">
                    Your invite link expires in 7 days.
                    <button
                      class="cursor-pointer text-blue-500 hover:underline"
                      :disabled="loading"
                      @click="generateInviteUrl"
                    >
                      Generate new link
                    </button>
                  </p>
                </section>
              </div>
            </DialogContent>
          </Transition>
        </div>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import type { Server } from '@prisma/client'
import { ServerSchema } from '@/validations/server'

const open = ref(false)
const route = useRoute()
const { data: server } = useNuxtData(`server-${route.params.sid}`)
const formValues = {
  name: server.value.name,
}

async function handleDeleteServer() {
  // const answer = await open({
  //   title: `Delete server "${server.value.name}"`,
  //   content: `Are you sure you want to delete "${server.value.name}"? This cannot be undone.`,
  //   okText: 'Delete Server',
  // })
  // if (answer === 'confirm') {
  //   deleteGuild(server.value.id)
  // }
}

const { $api } = useNuxtApp()
async function handleEditServer(values: any, { setErrors }: any) {
  try {
    await $api(`/servers/${route.params.sid}`, {
      method: 'PATCH',
      body: values,
    })
    refreshNuxtData('servers')
    refreshNuxtData(`server-${route.params.sid}`)
    open.value = false
  } catch (err: any) {
    console.error(err)
    // setErrors(toErrorMap(err))
  }
}

const invalidatingInvites = ref(false)
const invalidateSuccess = ref(false)
async function handleInvalidateInvites() {
  // invalidatingInvites.value = true
  // const { data } = await invalidateInviteLinks(server.value.id)
  // invalidatingInvites.value = false
  // if (data) {
  //   console.log(data)
  //   invalidateSuccess.value = true
  //   setTimeout(() => {
  //     invalidateSuccess.value = false
  //   }, 2000)
  // }
}
</script>

<template>
  <DialogRoot v-model:open="open">
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
                class="relative mx-auto w-screen max-w-md space-y-4 rounded-md bg-gray-700 px-6 py-4 text-header-secondary"
              >
                <header class="px-6 text-center">
                  <DialogClose
                    class="absolute right-4 top-4 grid h-8 w-8 place-items-center text-gray-300 transition-colors hover:text-gray-200"
                    aria-label="close"
                  >
                    <Icon name="lucide:x" size="20px" />
                  </DialogClose>
                  <DialogTitle class="text-2xl font-bold text-header-primary"
                    >Server Overview</DialogTitle
                  >
                </header>
                <Form
                  v-slot="{ isSubmitting }"
                  class="space-y-4"
                  :validation-schema="ServerSchema"
                  :initial-values="formValues"
                  @submit="handleEditServer"
                >
                  <main class="space-y-4">
                    <div class="flex justify-center">
                      <img
                        src="~/assets/discord.png"
                        class="h-24 w-24 rounded-full"
                        alt="guild avatar"
                      />
                    </div>
                    <div class="flex flex-col space-y-2">
                      <label class="text-xs font-bold uppercase" for="name"
                        >Server name</label
                      >
                      <Field
                        id="name"
                        name="name"
                        class="rounded border border-gray-900 bg-gray-900 p-2"
                      />
                      <ErrorMessage name="name" class="text-red-400" />
                    </div>
                    <div class="bg-divider my-4 h-px"></div>
                    <div class="space-y-2">
                      <h5 class="font-semibold">Additional Configuration</h5>
                      <div class="flex justify-between">
                        <BaseButton
                          type="button"
                          :loading="invalidatingInvites"
                          class="rounded px-4 py-2 text-white transition"
                          :class="[
                            invalidateSuccess
                              ? 'bg-green-500'
                              : 'bg-gray-600 hover:bg-gray-500',
                          ]"
                          @click="handleInvalidateInvites"
                        >
                          Invalidate Links
                        </BaseButton>
                        <button
                          type="button"
                          class="rounded bg-gray-600 px-4 py-2 text-white transition hover:bg-gray-500"
                        >
                          Bans
                        </button>
                      </div>
                      <button
                        class="px-4 py-2 text-red-400 hover:underline"
                        @click="handleDeleteServer"
                      >
                        Delete Server
                      </button>
                    </div>
                  </main>
                  <footer>
                    <div class="flex justify-between space-x-2">
                      <button
                        type="button"
                        class="rounded bg-transparent px-4 py-2 text-white hover:underline"
                        @click="open = false"
                      >
                        Cancel
                      </button>
                      <BaseButton
                        :loading="isSubmitting"
                        type="submit"
                        class="rounded bg-brand px-4 py-2 text-white transition hover:bg-brand-560 active:bg-brand-600"
                      >
                        Save Changes
                      </BaseButton>
                    </div>
                  </footer>
                </Form>
              </div>
            </DialogContent>
          </Transition>
        </div>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>

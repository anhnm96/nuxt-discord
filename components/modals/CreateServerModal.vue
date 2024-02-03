<script setup lang="ts">
import type { Server } from '@prisma/client'
import { ServerSchema } from '@/validations/server'

const open = ref(false)
const { user } = storeToRefs(useAuthStore())

const showModal = ref('select')
const transition = ref('slide-left')
async function createServer(values: any, { setErrors }: any) {
  try {
    await useAPI<Server>('/servers', {
      method: 'POST',
      body: values,
    })
    refreshNuxtData('servers')
    open.value = false
  } catch (err: any) {
    // setErrors(toErrorMap(err))
  }
}
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger
      class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-700 text-green-500 transition ease-out hover:rounded-2xl hover:bg-green-600 hover:text-white"
    >
      <Icon size="24px" name="lucide:plus" />
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
                class="relative mx-auto w-screen max-w-md overflow-hidden rounded bg-gray-700"
              >
                <Form
                  v-slot="{ isSubmitting }"
                  class="pt-6"
                  :validation-schema="ServerSchema"
                  @submit="createServer"
                >
                  <DialogClose
                    class="absolute right-3 top-3 grid h-8 w-8 place-items-center text-gray-300 transition-colors hover:text-gray-200"
                    aria-label="close"
                  >
                    <Icon name="lucide:x" size="20px" />
                  </DialogClose>
                  <header class="space-y-2 px-6 text-center">
                    <DialogTitle class="text-2xl font-bold text-white">
                      Customise your server
                    </DialogTitle>
                    <DialogDescription class="text-gray-100">
                      Give your new server a personality with a name and an
                      icon. You can always change it later.
                    </DialogDescription>
                  </header>
                  <section class="mt-4 space-y-4 px-6 text-gray-100">
                    <div class="flex flex-col space-y-2">
                      <label for="name" class="text-xs font-bold uppercase">
                        Server name
                      </label>
                      <Field
                        id="name"
                        v-focus
                        name="name"
                        type="text"
                        :value="`${user?.username}'s server`"
                        class="hover:border-input-hover rounded border border-input bg-gray-900 p-2"
                      />
                      <ErrorMessage class="text-red-400" name="name" />
                    </div>
                    <p class="text-xs">
                      By creating a server, you agree to Discord's
                      <b class="font-semibold text-link hover:underline">
                        Community Guidelines </b
                      >.
                    </p>
                  </section>
                  <section class="mt-4 bg-gray-800 px-6 py-4">
                    <div class="flex items-center justify-between">
                      <button
                        type="button"
                        class="rounded bg-transparent px-4 py-2 text-sm font-semibold text-white hover:underline"
                        @click="
                          () => {
                            transition = 'slide-right'
                            showModal = 'select'
                          }
                        "
                      >
                        Back
                      </button>
                      <BaseButton
                        type="submit"
                        class="rounded bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500/90"
                        :loading="isSubmitting"
                      >
                        Create
                      </BaseButton>
                    </div>
                  </section>
                </Form>
              </div>
            </DialogContent>
          </Transition>
        </div>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>

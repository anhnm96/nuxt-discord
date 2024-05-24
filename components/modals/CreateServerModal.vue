<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query'
import { ServerSchema } from '@/validations/server'
import { createServer, joinServer } from '~/handlers/servers'

const queryClient = useQueryClient()
const open = ref(false)
const { user } = storeToRefs(useAuthStore())

const showModal = ref('select')
const transition = ref('slide-left')
async function handleCreateServer(values: any, { setErrors }: any) {
  try {
    await createServer(values)
    queryClient.invalidateQueries({ queryKey: [serversKey] })
    open.value = false
  } catch (err: any) {
    setErrors(toErrorMap(err))
  }
}

async function handleJoinServer(values: any, { setErrors }: any) {
  if (!values.link) {
    setErrors({ link: 'Please enter a valid link.' })
    return
  }
  try {
    await joinServer(values.link)
    queryClient.invalidateQueries({ queryKey: [serversKey] })
    open.value = false
  } catch (err: any) {
    if (err?.response?.status.toString().startsWith('4')) {
      setErrors({ link: err?.response?.statusText })
    }
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
                <Transition :name="transition">
                  <div
                    v-if="showModal === 'select'"
                    class="pt-4 text-header-secondary"
                  >
                    <DialogClose
                      class="absolute right-3 top-3 grid h-8 w-8 place-items-center transition-colors hover:text-hover"
                      aria-label="close"
                    >
                      <Icon name="lucide:x" size="20px" />
                    </DialogClose>
                    <header class="space-y-2 px-6 text-center">
                      <DialogTitle class="text-2xl font-bold text-white"
                        >Add a server</DialogTitle
                      >
                      <p>
                        Your server is where you and your friends hang out. Make
                        yours and start talking.
                      </p>
                    </header>
                    <section class="mt-4 px-6">
                      <button
                        class="flex w-full items-center rounded-md border border-divider px-4 py-2 hover:bg-modifier-hover"
                        @click="
                          () => {
                            transition = 'slide-left'
                            showModal = 'create'
                          }
                        "
                      >
                        <img
                          class="h-12 w-12"
                          src="@/assets/create-guild.svg"
                          alt="create guild"
                        />
                        <p class="ml-2 truncate font-bold text-hover">
                          Create my own
                        </p>
                        <Icon
                          size="20px"
                          class="ml-auto"
                          name="lucide:chevron-right"
                        />
                      </button>
                    </section>
                    <section class="bg-secondary space-y-2 px-6 py-4">
                      <h2 class="text-center text-xl font-semibold">
                        Already have an invite?
                      </h2>
                      <button
                        class="w-full rounded bg-[#4f545c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5d6269] hover:text-white"
                        @click="
                          () => {
                            transition = 'slide-left'
                            showModal = 'join'
                          }
                        "
                      >
                        Join a server
                      </button>
                    </section>
                  </div>
                  <Form
                    v-else-if="showModal === 'create'"
                    v-slot="{ isSubmitting }"
                    class="pt-6"
                    :validation-schema="ServerSchema"
                    @submit="handleCreateServer"
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
                          v-focus:300
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
                          class="rounded bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-560 active:bg-brand-600"
                          :loading="isSubmitting"
                        >
                          Create
                        </BaseButton>
                      </div>
                    </section>
                  </Form>
                  <Form
                    v-else
                    v-slot="{ isSubmitting }"
                    class="block pt-4 text-header-secondary"
                    @submit="handleJoinServer"
                  >
                    <DialogClose
                      class="absolute right-3 top-3 grid h-8 w-8 place-items-center transition-colors hover:text-hover"
                      aria-label="close"
                    >
                      <Icon name="lucide:x" size="20px" />
                    </DialogClose>
                    <header class="space-y-2 px-6 text-center">
                      <DialogTitle class="text-2xl font-bold text-white"
                        >Join a server</DialogTitle
                      >
                      <p>Enter an invite below to join an existing server</p>
                    </header>
                    <section class="mt-4 space-y-4 px-6">
                      <div class="flex flex-col space-y-2">
                        <label for="link" class="text-xs font-bold uppercase"
                          >Invite link</label
                        >
                        <Field
                          id="link"
                          v-focus:300
                          name="link"
                          type="text"
                          class="hover:border-input-hover rounded border border-input bg-input p-2"
                        />
                        <ErrorMessage class="text-red-400" name="link" />
                      </div>
                      <div>
                        <h5 class="text-xs font-bold uppercase">
                          Invites should look like
                        </h5>
                        <p class="mt-2 text-sm text-white">hTKzmak</p>
                        <p class="text-sm text-white">
                          https://discord.gg/hTKzmak
                        </p>
                        <p class="text-sm text-white">
                          https://discord.gg/cool-people
                        </p>
                      </div>
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
                          :loading="isSubmitting"
                          type="submit"
                          class="rounded bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-560 active:bg-brand-600"
                        >
                          Join server
                        </BaseButton>
                      </div>
                    </section>
                  </Form>
                </Transition>
              </div>
            </DialogContent>
          </Transition>
        </div>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>

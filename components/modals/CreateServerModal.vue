<script setup lang="ts">
import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

const createServerSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, {
      message: 'Server name is required.',
    }),
    imageUrl: z.string().min(1, {
      message: 'Server image is required.',
    }),
  }),
)

const showModal = ref('select')
const transition = ref('slide-left')
async function createServer(values: any, { setErrors }: any) {
  try {
    // const { data } = await createGuild(values)
    // if (data) {
    //   cache.setQueryData(gKey, (guilds: any) => {
    //     return [...guilds, data]
    //   })
    //   emit('update:modelValue', false)
    //   router.push(`/channels/${data.id}/${data.default_channel_id}`)
    // }
  } catch (err: any) {
    // setErrors(toErrorMap(err))
  }
}
</script>

<template>
  <DialogRoot>
    <DialogTrigger
      class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-700 text-green-500 transition ease-out hover:rounded-2xl hover:bg-green-600 hover:text-white"
    >
      <Icon size="24px" name="lucide:plus" />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 bg-black/80" />
      <DialogContent
        class="fixed inset-0 z-50 flex h-full w-full items-center justify-center"
      >
        <div
          class="relative mx-auto w-screen max-w-md overflow-hidden rounded bg-gray-700"
        >
          <Form
            v-slot="{ isSubmitting }"
            class="pt-6"
            :validation-schema="createServerSchema"
            @submit="createServer"
          >
            <DialogClose
              class="hover:text-hover absolute right-3 top-3 grid h-8 w-8 place-items-center text-gray-100 transition-colors"
              aria-label="close"
            >
              <Icon name="lucide:x" size="20px" />
            </DialogClose>
            <header class="space-y-2 px-6 text-center">
              <DialogTitle class="text-2xl font-bold text-white">
                Customise your server
              </DialogTitle>
              <DialogDescription class="text-gray-100">
                Give your new server a personality with a name and an icon. You
                can always change it later.
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
                  value="User's server"
                  class="hover:border-input-hover border-input rounded border bg-gray-900 p-2"
                />
                <ErrorMessage class="text-red-400" name="name" />
              </div>
              <p class="text-xs">
                By creating a server, you agree to Discord's
                <b class="text-link font-semibold hover:underline">
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
                <b-button
                  :loading="isSubmitting"
                  type="submit"
                  class="rounded bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500/90"
                >
                  Create
                </b-button>
              </div>
            </section>
          </Form>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

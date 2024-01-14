<script setup lang="ts">
import { ChannelType } from '@prisma/client'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

const ChannelSchema = toTypedSchema(
  z.object({
    name: z
      .string()
      .min(1, {
        message: 'Channel name is required.',
      })
      .refine((name) => name !== 'general', {
        message: 'Channel name cannot be "general"',
      }),
    type: z.nativeEnum(ChannelType),
  }),
)

const modalStore = useModalStore()
const { $api } = useNuxtApp()
const route = useRoute()
async function handleCreateChannel(values: any, { setErrors }: any) {
  try {
    await $api(`/channels?serverId=${route.params.sid}`, {
      method: 'POST',
      body: { categoryId: modalStore.data.categoryId, ...values },
    })
    refreshNuxtData(`server-${route.params.sid}`)
    modalStore.close()
  } catch (err: any) {
    console.error(err)
    // setErrors(toErrorMap(err))
  }
}
</script>

<template>
  <DialogRoot v-model:open="modalStore.isOpen">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 bg-black/80" />
      <DialogContent
        class="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2"
      >
        <div
          class="relative mx-auto w-screen max-w-md overflow-hidden rounded-md bg-gray-700 text-gray-300"
        >
          <header class="p-4">
            <DialogTitle class="text-xl font-medium text-gray-100"
              >Create Channel</DialogTitle
            >
            <span
              v-if="modalStore.data.categoryName"
              class="text-xs text-gray-100"
              >In {{ modalStore.data.categoryName }}</span
            >
            <DialogClose
              class="absolute right-4 top-4 grid h-8 w-8 place-items-center text-gray-300 transition-colors hover:text-gray-200"
              aria-label="close"
            >
              <Icon name="lucide:x" size="20px" />
            </DialogClose>
          </header>
          <Form
            v-slot="{ isSubmitting, values }"
            :validation-schema="ChannelSchema"
            :initial-values="{ type: ChannelType.TEXT }"
            @submit="handleCreateChannel"
          >
            <main class="space-y-5 px-4 pb-5">
              <!-- channel type -->
              <div class="space-y-2">
                <p class="text-xs font-bold uppercase">Channel type</p>
                <div>
                  <Field
                    id="type1"
                    type="radio"
                    name="type"
                    class="hidden"
                    :value="ChannelType.TEXT"
                  />
                  <label
                    class="flex cursor-pointer items-center rounded bg-gray-600/80 p-3"
                    :class="[
                      values.type === ChannelType.TEXT
                        ? 'bg-gray-600/80'
                        : 'bg-gray-800',
                    ]"
                    for="type1"
                  >
                    <Icon class="mr-3" size="24px" name="mdi:hashtag" />
                    <div>
                      <p class="text-gray-100">Text</p>
                      <p class="text-sm">
                        Post images, GIFs, stickers, opinions and puns
                      </p>
                    </div>
                    <Icon
                      v-if="values.type === ChannelType.TEXT"
                      class="ml-auto"
                      size="24px"
                      name="mdi:radiobox-marked"
                    />
                    <Icon
                      v-else
                      class="ml-auto"
                      size="24px"
                      name="mdi:radiobox-blank"
                    />
                  </label>
                </div>
                <div>
                  <Field
                    id="type2"
                    type="radio"
                    name="type"
                    class="hidden"
                    :value="ChannelType.AUDIO"
                  />
                  <label
                    class="flex cursor-pointer items-center rounded p-3"
                    :class="[
                      values.type === ChannelType.AUDIO
                        ? 'bg-gray-600/80'
                        : 'bg-gray-800',
                    ]"
                    for="type2"
                  >
                    <Icon class="mr-3" size="24px" name="mdi:volume-high" />
                    <div>
                      <p class="text-gray-100">Voice</p>
                      <p class="text-sm">
                        Hang out together with voice, video and screen share
                      </p>
                    </div>
                    <Icon
                      v-if="values.type === ChannelType.AUDIO"
                      class="ml-auto"
                      size="24px"
                      name="mdi:radiobox-marked"
                    />
                    <Icon
                      v-else
                      class="ml-auto"
                      size="24px"
                      name="mdi:radiobox-blank"
                    />
                  </label>
                </div>
              </div>
              <!-- channel name -->
              <div class="space-y-2">
                <label
                  for="name"
                  class="text-xs font-bold uppercase text-gray-200"
                  >Channel name</label
                >
                <div class="relative">
                  <Icon
                    class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-200"
                    name="mdi:hashtag"
                  />
                  <Field
                    id="name"
                    name="name"
                    class="w-full rounded border border-gray-900 bg-gray-900 py-2 pl-8 pr-2 outline-none"
                    type="text"
                    placeholder="new-channel"
                    autocomplete="off"
                  />
                </div>
                <ErrorMessage class="text-red-400" name="name" />
              </div>
              <!-- <div class="space-y-2">
            <div class="flex justify-between">
              <label
                for="isPublic"
                class="flex items-center flex-grow space-x-2"
              >
                <LockClosedIcon class="w-4 h-4" />
                <span>Private channel</span>
              </label>
              <Field id="isPublic" type="checkbox" name="isPublic" />
            </div>
            <p class="text-sm">
              By making a channel private, only select members and roles will be
              able to view this channel.
            </p>
          </div> -->
            </main>
            <footer class="bg-gray-800 p-4">
              <div class="flex justify-between space-x-2">
                <button
                  type="button"
                  class="rounded bg-transparent px-4 py-2 text-white hover:underline"
                  @click="modalStore.close()"
                >
                  Cancel
                </button>
                <BaseButton
                  :loading="isSubmitting"
                  type="submit"
                  class="rounded bg-brand px-4 py-2 text-white transition hover:bg-brand-560 active:bg-brand-600"
                >
                  Create Channel
                </BaseButton>
              </div>
            </footer>
          </Form>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

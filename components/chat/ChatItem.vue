<script setup lang="ts">
import type { MessageWithMember } from '@/types'
import { deleteMessage, updateMessage } from '~/handlers/messages'

const props = defineProps<{
  message: MessageWithMember
  showHeader: boolean
  urlQuery: string
}>()

const isEditing = ref(false)
const textareaEl = ref<HTMLDivElement>()

function enableEdit() {
  isEditing.value = true
  nextTick(() => {
    if (textareaEl.value) {
      textareaEl.value.focus()
      textareaEl.value.innerText = props.message.content
      // set caret at the end
      if (
        typeof window.getSelection != 'undefined' &&
        typeof document.createRange != 'undefined'
      ) {
        const range = document.createRange()
        range.selectNodeContents(textareaEl.value)
        range.collapse(false)
        const sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(range)
      }
    }
  })
  document.addEventListener('keydown', handleKeydownEvent)
}

function submitEditMessage() {
  const content = textareaEl.value?.innerText?.trim()

  if (!content || content === props.message.content) {
    cancelEditMessage()
    return
  }
  updateMessage(props.message.id, props.urlQuery, content)
  cancelEditMessage()
}

function cancelEditMessage() {
  isEditing.value = false
  document.removeEventListener('keydown', handleKeydownEvent)
}

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydownEvent)
})

function handleKeydownEvent(e: KeyboardEvent) {
  if (e.code === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    submitEditMessage()
  }

  if (e.code === 'Escape') {
    cancelEditMessage()
  }
}

function handleDeleteMessage() {
  deleteMessage(props.message.id, props.urlQuery)
}

const [DefineMessageTemplate, ReuseMessageTemplate] = createReusableTemplate<{
  cls?: string
}>()
</script>

<template>
  <div>
    <DefineMessageTemplate v-slot="{ cls }">
      <p v-if="!isEditing" class="text-gray-100" :class="[cls]">
        {{ message.content }}
        <time
          v-if="message.createdAt !== message.updatedAt"
          class="ml-px select-none text-xs text-muted"
          :datetime="message.updatedAt.toString()"
          :aria-label="getTime(message.updatedAt)"
          :title="getTime(message.updatedAt)"
          >(edited)</time
        >
      </p>
      <div v-else class="mt-2" :class="[cls]">
        <div
          ref="textareaEl"
          contenteditable="true"
          class="rounded bg-textarea px-4 py-2.5 caret-gray-300"
        ></div>
        <p class="my-2 text-xs">
          escape to
          <button class="text-link hover:underline" @click="cancelEditMessage">
            cancel
          </button>
          • enter to
          <button class="text-link hover:underline" @click="submitEditMessage">
            save
          </button>
        </p>
      </div>
      <ChatActions
        :message="message"
        @edit="enableEdit"
        @delete="handleDeleteMessage"
      />
    </DefineMessageTemplate>
    <div
      v-if="showHeader"
      class="group relative mt-[17px] flex py-0.5 pl-4 pr-16 leading-[22px] hover:bg-gray-950/[.07]"
    >
      <AvatarRoot
        class="mr-4 mt-0.5 inline-flex h-10 w-10 select-none items-center justify-center rounded-full bg-gray-800"
      >
        <AvatarImage
          v-if="message.member.profile.imageUrl"
          class="h-full w-full rounded-[inherit] object-cover"
          :src="message.member.profile.imageUrl"
          :alt="message.member.profile.username"
        />
        <AvatarFallback class="font-medium uppercase" :delay-ms="600">
          {{ message.member.profile.username?.slice(0, 2) }}
        </AvatarFallback>
      </AvatarRoot>
      <div class="flex-1">
        <p class="flex items-baseline">
          <span class="mr-2 font-medium text-green-400">
            {{ message.member.profile.username }}
          </span>
          <time
            class="text-xs font-medium text-muted"
            :datetime="message.createdAt.toString()"
          >
            {{ getTime(message.createdAt) }}
          </time>
        </p>
        <ReuseMessageTemplate />
      </div>
    </div>
    <div
      v-else
      class="group relative py-0.5 pl-4 pr-16 leading-[22px] hover:bg-gray-950/[.07]"
    >
      <time
        class="absolute bottom-0 left-4 top-0 hidden w-10 select-none items-center justify-end text-xs font-medium text-muted group-hover:flex"
        :datetime="message.createdAt.toString()"
        :title="getTime(message.createdAt)"
      >
        {{ getShortenedTime(message.createdAt) }}
      </time>
      <ReuseMessageTemplate cls="pl-14" />
    </div>
  </div>
</template>

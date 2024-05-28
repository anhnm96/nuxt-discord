<script setup lang="ts">
import { sendMessage } from '~/handlers/messages'

const route = useRoute()
const serverId = route.params.sid as string
const channelId = route.params.cid as string
const { socket } = useSocket()
const userStore = useAuthStore()
const channelStore = useChannelStore()
const isTyping = ref(false)
const inputEl = ref<HTMLDivElement | null>(null)
const { data: channel, suspense } = useGetCurrentChannel(channelId)
await suspense()
// ? useGetCurrentChannel(serverId, channelId)
// : useGetCurrentDM(channelId)

const placeholder = computed(() => {
  // if (channel.value?.user) {
  //   return `Message @${channel.value.user.username}`
  // }
  return `Message #${channel.value?.name}`
})

let timeout: NodeJS.Timeout
const showPlaceholder = ref(true)
function handleOnInput(e: any) {
  if (e.target.innerText.trim() !== '') {
    showPlaceholder.value = false
  } else {
    showPlaceholder.value = true
  }
  if (!isTyping.value) {
    isTyping.value = true
    socket.emit('startTyping', channelId, userStore.user?.username)
    timeout = setTimeout(() => {
      isTyping.value = false
      socket.emit('stopTyping', channelId, userStore.user?.username)
    }, 2000)
  } else {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      isTyping.value = false
      socket.emit('stopTyping', channelId, userStore.user?.username)
    }, 2000)
  }
}

function handleAddEmoji(emoji: string) {
  showPlaceholder.value = false
  const lastNode = inputEl.value?.lastChild

  if (lastNode && lastNode.nodeName === 'BR') {
    const secondLastNode = lastNode.previousSibling
    if (secondLastNode && secondLastNode.nodeName === 'BR') {
      ;(secondLastNode as HTMLBRElement).insertAdjacentText('afterend', emoji)
      setSelectionToEnd(lastNode.previousSibling)
    } else if (secondLastNode) {
      secondLastNode.textContent += emoji
      setSelectionToEnd(lastNode.previousSibling)
    } else {
      ;(lastNode as HTMLBRElement).insertAdjacentText('beforebegin', emoji)
      setSelectionToEnd(inputEl.value?.lastChild as ChildNode)
    }
  } else {
    inputEl.value!.textContent += emoji
    setSelectionToEnd(inputEl.value!.lastChild!)
  }
}

function setSelectionToEnd(targetNode: ChildNode) {
  const selection = window.getSelection()
  if (selection) {
    selection.collapse(targetNode, targetNode.textContent?.length)
  }
}

function handleSendMessage(e: KeyboardEvent) {
  const textEl = e.target as HTMLDivElement
  if (!textEl.innerText.trim()) return
  isTyping.value = false
  socket.emit('stopTyping', channelId, userStore.user?.username)
  clearTimeout(timeout)
  sendMessage(serverId, channelId, textEl.innerText.trim())
  // update message
  // cache.setQueryData(`messages-${channelId}`, (d: any) => {
  //   if (!d) return
  //   const res = { pages: [...d.pages], pageParams: d.pageParams }
  //   const copy = [...res.pages[0]]
  //   const date = Date.now() - 9 * 60 * 60 * 1000
  //   copy.unshift({
  //     text: textEl.innerText.trim(),
  //     id: `${Math.random()}`,
  //     createdAt: new Date(date).toISOString(),
  //     updatedAt: new Date(date).toISOString(),
  //     user: userStore.user,
  //   })
  //   res.pages[0] = copy
  //   return res
  // })
  textEl.innerText = ''
}

const typingString = computed(() => {
  switch (channelStore.typingUsers.length) {
    case 0:
      return ''
    case 1:
      return `${channelStore.typingUsers[0]} is typing`
    case 2:
      return `${channelStore.typingUsers[0]} and ${channelStore.typingUsers[1]} are typing`
    case 3:
      return `${channelStore.typingUsers[0]}, ${channelStore.typingUsers[1]} and ${channelStore.typingUsers[2]} are typing`
    default:
      return 'Several people are typing'
  }
})
</script>

<template>
  <p v-show="typingString" class="absolute -top-px left-4 text-xs italic">
    {{ typingString }}...
  </p>
  <div class="flex rounded-lg bg-textarea">
    <button class="self-start px-4 py-2 text-gray-400 hover:text-gray-300">
      <Icon size="24px" name="lucide:plus-circle" />
    </button>
    <div class="relative flex-auto">
      <div
        v-show="showPlaceholder"
        class="pointer-events-none absolute left-0 top-0 py-2.5 pr-4 text-muted"
        aria-hidden="true"
      >
        {{ placeholder }}
      </div>
      <div
        ref="inputEl"
        contenteditable="true"
        class="rounded py-2.5 pr-4 caret-gray-300 outline-none"
        @input="handleOnInput"
        @keydown.enter.exact.prevent="handleSendMessage"
      ></div>
      <div class="absolute right-0 top-0 py-2.5 pr-4">
        <EmojiPicker @select="handleAddEmoji" />
      </div>
    </div>
  </div>
</template>

import type { Channel, ChannelType, Server } from '@prisma/client'

export type ModalType = 'createChannel'

interface ModalData {
  server?: Server
  channel?: Channel
  channelType?: ChannelType
  apiUrl?: string
  query?: Record<string, any>
}

export const useModalStore = defineStore('modal-store', () => {
  let type: ModalType | null = null
  let data: ModalData = {}
  const isOpen = ref(false)
  function open(_type: ModalType, _data: ModalData = {}) {
    isOpen.value = true
    type = _type
    data = _data
  }

  function close() {
    type = null
    isOpen.value = false
  }

  return { type, data, isOpen, open, close }
})

import type { Category, Channel, Server } from '@prisma/client'

export type ModalType = 'createChannel' | 'editChannel'

interface ModalData {
  server?: Server
  category?: Category
  channel?: Channel
  apiUrl?: string
  query?: Record<string, any>
}

export const useModalStore = defineStore('modal-store', () => {
  const type = ref<ModalType | null>(null)
  const data = ref<ModalData>({})
  const isOpen = ref(false)
  function open(_type: ModalType, _data: ModalData = {}) {
    isOpen.value = true
    type.value = _type
    data.value = _data
  }

  function close() {
    type.value = null
    isOpen.value = false
    data.value = {}
  }

  return { type, data, isOpen, open, close }
})

import type { Member, Message, Profile } from '@prisma/client'
import { useQueryClient } from '@tanstack/vue-query'

interface ChatSocketProps {
  channelId: string
  addKey: string
  updateKey: string
  deleteKey: string
  queryKey: string
}

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile
  }
}

export function useChatSocket({
  channelId,
  addKey,
  updateKey,
  deleteKey,
  queryKey,
}: ChatSocketProps) {
  const { socket } = useSocket()
  const authStore = useAuthStore()
  const channelStore = useChannelStore()
  const queryClient = useQueryClient()

  onMounted(() => {
    if (!socket) {
      return
    }
    socket.emit('joinChannel', channelId)

    socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData
        }

        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithMemberWithProfile) => {
              if (item.id === message.id) {
                return message
              }
              return item
            }),
          }
        })

        return {
          ...oldData,
          pages: newData,
        }
      })
    })

    socket.on(deleteKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData
        }

        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.filter((item: MessageWithMemberWithProfile) => {
              return item.id !== message.id
            }),
          }
        })

        return {
          ...oldData,
          pages: newData,
        }
      })
    })

    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [
              {
                items: [message],
              },
            ],
          }
        }

        const newData = [...oldData.pages]

        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items],
        }

        return {
          ...oldData,
          pages: newData,
        }
      })
    })

    socket.on('addToTyping', (username: string) => {
      if (username !== authStore.user?.username) {
        channelStore.addTyping(username)
      }
    })

    socket.on('removeFromTyping', (username: string) => {
      if (username !== authStore.user?.username) {
        channelStore.removeTyping(username)
      }
    })
  })

  onBeforeUnmount(() => {
    socket.emit('leaveRoom', channelId)
    socket.off(addKey)
    socket.off(updateKey)
    socket.off(deleteKey)
    socket.off('addToTyping')
    socket.off('removeFromTyping')
  })
}

import type { Member, Message, Profile } from '@prisma/client'
import { useQueryClient } from '@tanstack/vue-query'

interface ChatSocketProps {
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
  addKey,
  updateKey,
  deleteKey,
  queryKey,
}: ChatSocketProps) {
  const { socket } = useSocket()
  const queryClient = useQueryClient()

  onMounted(() => {
    if (!socket) {
      return
    }

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

    return () => {
      socket.off(addKey)
      socket.off(updateKey)
      socket.off(deleteKey)
    }
  })
}

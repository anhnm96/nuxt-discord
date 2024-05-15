import type { Server } from '@prisma/client'
import { useQueryClient } from '@tanstack/vue-query'

export default function useServerSocket() {
  const cache = useQueryClient()
  const { socket } = useSocket()
  const authStore = useAuthStore()

  onMounted(() => {
    socket.emit('joinUser', authStore.user?.id)
    socket.on('edit_server', (editedServer: Server) => {
      cache.setQueryData(
        [serversKey, editedServer.id],
        (d: Server | undefined): any => {
          if (!d) return
          const copy = {
            ...d,
            name: editedServer.name,
            imageUrl: editedServer.imageUrl,
          }

          return copy
        },
      )
    })

    socket.on('delete_server', (deleteId: string) => {
      cache.setQueryData([serversKey], (d: Server[] | undefined): any => {
        const isActive = location.pathname.includes(deleteId)
        if (isActive) {
          navigateTo('/')
        }
        return d?.filter((s) => s.id !== deleteId)
      })
    })
  })

  onBeforeUnmount(() => {
    socket.emit('leaveRoom', authStore.user?.id)
  })
}

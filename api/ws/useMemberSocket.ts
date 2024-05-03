import { useQueryClient } from '@tanstack/vue-query'
import type { MemberWithProfile } from '~/types'

export default function useMemberSocket(serverId: string) {
  const cache = useQueryClient()
  const { socket } = useSocket()
  const key = mKey(serverId)

  onMounted(() => {
    socket.on('toggle_online', (memberId: string) => {
      cache.setQueryData(
        [key],
        (data: MemberWithProfile[] | undefined): any => {
          if (!data) return
          const res = [...data]
          const index = res.findIndex((m) => m.id === memberId)
          if (index === -1) return
          const clonedObj = { ...res[index] }
          clonedObj.profile.isOnline = true
          res[index] = clonedObj

          return res
        },
      )
    })

    socket.on('toggle_offline', (memberId: string) => {
      cache.setQueryData(
        [key],
        (data: MemberWithProfile[] | undefined): any => {
          if (!data) return
          const res = [...data]
          const index = res.findIndex((m) => m.id === memberId)
          if (index === -1) return
          const clonedObj = { ...res[index] }
          clonedObj.profile.isOnline = false
          res[index] = clonedObj

          return res
        },
      )
    })
  })
}

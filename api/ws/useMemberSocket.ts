import { useQueryClient } from '@tanstack/vue-query'
import type { MemberWithProfile } from '~/types'

export default function useMemberSocket(serverId: string) {
  const cache = useQueryClient()
  const { socket } = useSocket()
  const key = mKey(serverId)

  onMounted(() => {
    socket.on('toggle_online', (profileId: string) => {
      cache.setQueryData(
        [key],
        (data: MemberWithProfile[] | undefined): any => {
          if (!data) return
          const res = structuredClone(data)
          const member = res.find((m) => m.profileId === profileId)
          if (!member) return
          member.profile.isOnline = true

          return res
        },
      )
    })

    socket.on('toggle_offline', (profileId: string) => {
      cache.setQueryData(
        [key],
        (data: MemberWithProfile[] | undefined): any => {
          if (!data) return
          const res = structuredClone(data)
          const member = res.find((m) => m.profileId === profileId)
          if (!member) return
          member.profile.isOnline = false

          return res
        },
      )
    })
  })
}

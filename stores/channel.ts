import { type Member, MemberRole } from '@prisma/client'
import { useQuery } from '@tanstack/vue-query'
import { getChannel } from '~/api/handlers/channel'

interface ChannelState {
  currentMember: Member | null | undefined
  typingUsers: string[]
}

export const useChannelStore = defineStore('channel-store', {
  state: () => {
    return {
      currentMember: null,
      typingUsers: [],
    } as ChannelState
  },
  getters: {
    isAdmin(state) {
      return state.currentMember?.role === MemberRole.ADMIN
    },
    isModerator(state) {
      return state.currentMember?.role === MemberRole.MODERATOR
    },
  },
  actions: {
    setCurrentMember(member: Member) {
      this.currentMember = member
    },
    addTyping(username: string) {
      this.typingUsers.push(username)
    },
    removeTyping(username: string) {
      this.typingUsers = this.typingUsers.filter((u) => u !== username)
    },
  },
})

export function useGetCurrentChannel(channelId: string) {
  return useQuery({
    queryKey: [`channels-${channelId}`],
    queryFn: () => getChannel(channelId),
  })
}

interface ChannelState {
  typingUsers: string[]
}

export const useChannelStore = defineStore('channel-store', {
  state: () => {
    return {
      typingUsers: [],
    } as ChannelState
  },
  actions: {
    addTyping(username: string) {
      this.typingUsers.push(username)
    },
    removeTyping(username: string) {
      this.typingUsers = this.typingUsers.filter((u) => u !== username)
    },
  },
})

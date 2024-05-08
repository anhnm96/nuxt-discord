import type { ChannelWithDetails } from '~/types'

export function getChannel(id: string) {
  return useNuxtApp().$api<ChannelWithDetails>(`/channels/${id}`)
}

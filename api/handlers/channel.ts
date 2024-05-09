import type { ChannelWithDetails } from '~/types'
import type { ChannelPayload } from '~/validations/channel'

export function getChannel(id: string) {
  return useNuxtApp().$api<ChannelWithDetails>(`/channels/${id}`)
}

export function createChannel(
  serverId: string,
  categoryId: string,
  payload: ChannelPayload,
) {
  return useNuxtApp().$api(
    `/channels?serverId=${serverId}&categoryId=${categoryId}`,
    {
      method: 'POST',
      body: payload,
    },
  )
}

export function updateChannel(
  channelId: string,
  serverId: string,
  categoryId: string,
  payload: { name: string },
) {
  return useNuxtApp().$api(
    `/channels/${channelId}?serverId=${serverId}&categoryId=${categoryId}`,
    {
      method: 'PATCH',
      body: payload,
    },
  )
}

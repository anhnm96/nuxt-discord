export function getMessages(
  apiUrl: string,
  pageParam: string,
  paramKey: string,
  paramValue: string,
) {
  return useNuxtApp().$api(
    `${apiUrl}?cursor=${pageParam}&${paramKey}=${paramValue}`,
  )
}

export function sendMessage(
  serverId: string,
  channelId: string,
  content: string,
) {
  return useNuxtApp().$api(
    `/socket/messages?serverId=${serverId}&channelId=${channelId}`,
    {
      method: 'POST',
      body: { content },
    },
  )
}

export function deleteMessage(id: string, query: string) {
  return useNuxtApp().$api(`/socket/messages/${id}?${query}`, {
    method: 'DELETE',
  })
}

export function updateMessage(id: string, query: string, content: string) {
  return useNuxtApp().$api(`/socket/messages/${id}?${query}`, {
    method: 'PATCH',
    body: { content },
  })
}

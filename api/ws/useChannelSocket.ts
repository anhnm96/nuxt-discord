import type { Channel } from '@prisma/client'
import { useQueryClient } from '@tanstack/vue-query'

export default function useChannelSocket(
  serverId: string,
  channelQueryKey: string,
) {
  const cache = useQueryClient()
  const { socket } = useSocket()

  onMounted(() => {
    socket.emit('joinServer', serverId)

    socket.on('add_channel', (newChannel) => {
      console.log('add_channel', newChannel)
      cache.invalidateQueries({ queryKey: [channelQueryKey] })
      // cache.setQueryData(key, (data) => {
      //   return [...data, newChannel];
      // });
    })

    socket.on('edit_channel', (editedChannel: Channel) => {
      console.log('edit_channel', editedChannel)
      cache.invalidateQueries({ queryKey: [channelQueryKey] })
      // cache.setQueryData([channelQueryKey], (d: Channel[] | undefined): any => {
      //   if (!d) return
      //   const res = [...d]
      //   const index = res.findIndex((c) => c.id === editedChannel.id)
      //   if (index !== -1) {
      //     res[index] = editedChannel
      //   } else if (editedChannel.isPublic) {
      //     res.push(editedChannel)
      //   }
      //   return res
      // })
    })

    socket.on('delete_channel', (deleteId: string) => {
      cache.invalidateQueries({ queryKey: [channelQueryKey] })
      //   console.log('delete_channel', deleteId)
      //   cache.setQueryData(key, (d) => {
      //     const currentPath = `/channels/${serverId}/${deleteId}`
      //     if (location.pathname === currentPath && guild) {
      //       if (deleteId === guild.value?.default_channel_id) {
      //         router.replace('/channels/me')
      //       } else {
      //         router.replace(`${guild.value?.default_channel_id}`)
      //       }
      //     }
      //     return d?.filter((c) => c.id !== deleteId)
      //   })
    })

    // socket.on('new_notification', (id: string) => {
    //   console.log('new_notification', id)
    //   const currentPath = `/channels/${serverId}/${id}`
    //   if (location.pathname !== currentPath) {
    //     cache.setQueryData(key, (d) => {
    //       const index = d?.findIndex((c) => c.id === id)
    //       if (index !== -1) {
    //         d[index] = { ...d[index], hasNotification: true }
    //       }
    //       return d
    //     })
    //   }
    // })
  })

  onBeforeUnmount(() => {
    socket.emit('leaveServer', serverId)
    socket.disconnect()
  })
}

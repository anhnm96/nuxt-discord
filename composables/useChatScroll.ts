interface ChatScrollProps {
  chatRef: Ref<HTMLDivElement>
  bottomRef: Ref<HTMLDivElement>
  shouldLoadMore: ComputedRef<boolean>
  loadMore: () => void
}

export function useChatScroll({
  chatRef,
  bottomRef,
  shouldLoadMore,
  loadMore,
}: ChatScrollProps) {
  const hasInitialized = ref(false)
  const topDiv = chatRef?.value
  const bottomDiv = bottomRef?.value

  const handleScroll = () => {
    const scrollTop = topDiv?.scrollTop

    if (scrollTop === 0 && shouldLoadMore.value) {
      loadMore()
    }
  }

  onMounted(() => {
    topDiv?.addEventListener('scroll', handleScroll)

    const shouldAutoScroll = () => {
      if (!hasInitialized.value && bottomDiv) {
        hasInitialized.value = true
        return true
      }

      if (!topDiv) {
        return false
      }

      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight
      return distanceFromBottom <= 100
    }

    if (shouldAutoScroll()) {
      console.log('autoscroll')
      setTimeout(() => {
        bottomRef.value?.scrollIntoView({
          behavior: 'smooth',
        })
      }, 100)
    }
  })

  onBeforeUnmount(() => {
    topDiv?.removeEventListener('scroll', handleScroll)
  })
}

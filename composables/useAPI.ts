import type { UseFetchOptions } from 'nuxt/app'

export function useAPI<T>(
  url: string | (() => string),
  options: UseFetchOptions<T> = {},
) {
  return useFetch(url, {
    ...options,
    headers: useRequestHeaders(['cookie']),
    $fetch: useNuxtApp().$api,
  })
}

import type { UseFetchOptions } from 'nuxt/app'

export function useAPI<T>(
  url: string | (() => string),
  options: UseFetchOptions<T> = {},
) {
  return useFetch(url, {
    ...options,
    headers: useRequestHeaders(['cookie']),
    $fetch: $fetch.create({
      baseURL: '/api',
      // @ts-expect-error
      onResponseError({ response }) {
        if (response.status === 401) {
          return navigateTo('/login')
        }
      },
    }),
  })
}

import type { UseFetchOptions } from 'nuxt/app'

export function useAPI<T>(
  url: string | (() => string),
  options: UseFetchOptions<T> = {},
) {
  const token = useLocalStorage('token', '')
  return useFetch(url, {
    ...options,
    $fetch: $fetch.create({
      baseURL: '/api',
      onRequest({ options }) {
        if (token) {
          // Add Authorization header
          options.headers = options.headers || {}
          // @ts-expect-error
          options.headers.Authorization = `Bearer ${token}`
        }
      },
      // @ts-expect-error
      onResponseError({ response }) {
        if (response.status === 401) {
          return navigateTo('/login')
        }
      },
    }),
  })
}

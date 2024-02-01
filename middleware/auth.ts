import type { Profile } from '@prisma/client'

export default defineNuxtRouteMiddleware(async (to) => {
  const { data, error } = await useAPI<Profile>('/users/me')

  if (error.value) {
    if (import.meta.server)
      return navigateTo(`/login?redirectTo=${to.path}`, { redirectCode: 301 })

    if (import.meta.client)
      return navigateTo(`/login?redirectTo=${to.path}`, { replace: true })
  }

  const authStore = useAuthStore()
  if (data.value) {
    authStore.user = data.value
  }
})

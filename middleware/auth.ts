import type { Profile } from '@prisma/client'

export default defineNuxtRouteMiddleware(async (to) => {
  const { data, error } = await useAPI<Profile>('/users/me')

  if (error.value) {
    if (process.server)
      return navigateTo(`/login?redirectTo=${to.path}`, { redirectCode: 301 })

    if (process.client)
      return navigateTo(`/login?redirectTo=${to.path}`, { replace: true })
  }

  const authStore = useAuthStore()
  if (data.value) {
    authStore.user = data.value
  }
})

import type { Profile } from '@prisma/client'
import { useQueryClient } from '@tanstack/vue-query'

interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: Profile
  expiresAt: number
}

export const useAuthStore = defineStore('auth-store', () => {
  const user = ref<Profile | null>(null)
  const { $api } = useNuxtApp()
  const queryClient = useQueryClient()

  async function login(payload: any) {
    const route = useRoute()
    const data = await $api<LoginResponse>('/auth/sign-in', {
      method: 'post',
      body: payload,
    })

    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('expiresAt', data.expiresAt.toString())
    user.value = data.user
    const redirectTo = (route.query.redirectTo as string) || '/'
    navigateTo(redirectTo, { replace: true })
  }

  async function register(payload: any) {
    const data = await $api<LoginResponse>('/auth/sign-up', {
      method: 'post',
      body: payload,
    })

    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('expiresAt', data.expiresAt.toString())
    user.value = data.user
    navigateTo('/', { replace: true })
  }

  async function logout() {
    await useAPI('/auth/sign-out', { method: 'POST' })
    user.value = null
    queryClient.clear()
    localStorage.clear()
    navigateTo('/')
  }

  return { user, login, register, logout }
})

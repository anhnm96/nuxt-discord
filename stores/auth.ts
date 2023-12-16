import type { Profile } from '@prisma/client'

interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: Profile
  expiresAt: number
}

export const useAuthStore = defineStore('auth-store', () => {
  const user = ref<Profile | null>(null)

  async function login(payload: any) {
    const route = useRoute()
    const { data, error } = await useAPI<LoginResponse>('/auth/sign-in', {
      method: 'post',
      body: payload,
    })

    if (error.value) throw new Error(error.value.statusMessage)

    if (data.value) {
      localStorage.setItem('user', JSON.stringify(data.value.user))
      localStorage.setItem('expiresAt', data.value.expiresAt.toString())
      user.value = data.value.user
      const redirectTo = (route.query.redirectTo as string) || '/'
      navigateTo(redirectTo, { replace: true })
    }
  }

  async function logout() {
    await useAPI('/auth/sign-out', { method: 'POST' })
    user.value = null
    localStorage.clear()
    navigateTo('/')
  }

  return { user, login, logout }
})

import type { Profile } from '@prisma/client'

interface LoginDto {
  accessToken: string
  refreshToken: string
  user: Profile
}

export const useAuthStore = defineStore('auth-store', () => {
  const user = useLocalStorage<Profile | null>('user', null)
  const route = useRoute()

  async function login(payload: any) {
    const { data, error } = await useAPI<LoginDto>('/auth/sign-in', {
      method: 'post',
      body: payload,
    })

    if (error.value) throw new Error(error.value.statusMessage)

    if (data.value) {
      localStorage.setItem('token', data.value.accessToken)
      user.value = data.value.user
      const redirectTo = (route.query.redirectTo as string) || '/'
      navigateTo(redirectTo, { replace: true })
    }
  }

  function logout() {
    user.value = null
    localStorage.clear()
    navigateTo('/')
  }

  return { user, login, logout }
})

import type { Profile } from '@prisma/client'

interface LoginDto {
  accessToken: string
  refreshToken: string
  user: Profile
}

export const useAuthStore = defineStore('auth-store', () => {
  const user = ref<Profile | null>(null)

  async function login(payload: any) {
    const { data, error } = await useAPI<LoginDto>('/auth/sign-in', {
      method: 'post',
      body: payload,
    })

    if (error.value) throw new Error(error.value.statusMessage)

    if (data.value) {
      localStorage.setItem('token', data.value.accessToken)
      user.value = data.value.user
      navigateTo('/')
    }
  }

  function logout() {
    user.value = null
    localStorage.clear()
    navigateTo('/')
  }

  return { user, login, logout }
})

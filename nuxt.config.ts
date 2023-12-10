// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-icon', 'radix-vue/nuxt'],
  runtimeConfig: {
    jwtSecret: '',
    tokenAudience: '',
    tokenIssuer: '',
    accessTokenTtl: '',
    refreshTokenTtl: '',
  },
})

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-icon',
    'radix-vue/nuxt',
    '@vee-validate/nuxt',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],
  runtimeConfig: {
    jwtSecret: '',
    jwtTokenAudience: '',
    jwtTokenIssuer: '',
    jwtAccessTokenTtl: '',
    jwtRefreshTokenTtl: '',
  },
  components: {
    dirs: [
      {
        path: '~/components/modals',
        extensions: ['vue'],
        pathPrefix: false,
      },
      {
        path: '~/components',
      },
    ],
  },
})

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
  app: {
    pageTransition: { name: 'page', mode: 'out-in', appear: true },
  },
  runtimeConfig: {
    jwtSecret: '',
    jwtTokenAudience: '',
    jwtTokenIssuer: '',
    jwtAccessTokenTtl: '',
    jwtRefreshTokenTtl: '',
    public: {
      apiBase: '',
    },
  },
  components: {
    dirs: [
      {
        path: '~/components/modals',
        extensions: ['vue'],
        pathPrefix: false,
      },
      {
        path: '~/components/chat',
        extensions: ['vue'],
        pathPrefix: false,
      },
      {
        path: '~/components',
      },
    ],
  },
  nitro: {
    experimental: {
      websocket: true,
    },
  },
})

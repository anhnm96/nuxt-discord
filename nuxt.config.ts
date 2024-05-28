// import { createRequire } from 'node:module'

// const prismaClientPath = createRequire(import.meta.url).resolve(
//   '@prisma/client',
// )

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: false,
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
  vite: {
    resolve: {
      alias: {
        // https://github.com/prisma/prisma/issues/12504
        // '.prisma/client/index-browser': prismaClientPath.replace(
        //   '@prisma/client/default.js',
        //   '.prisma/client/index-browser.js',
        // ),
      },
    },
  },
})

export default defineNuxtPlugin((nuxtApp) => {
  if (process.server) return nuxtApp.vueApp.directive('focus', {})

  nuxtApp.vueApp.directive('focus', {
    mounted(el) {
      el.focus()
    },
  })
})

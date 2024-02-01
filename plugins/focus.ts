export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) return nuxtApp.vueApp.directive('focus', {})

  nuxtApp.vueApp.directive('focus', {
    mounted(el) {
      el.focus()
    },
  })
})

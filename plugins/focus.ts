export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) return nuxtApp.vueApp.directive('focus', {})

  nuxtApp.vueApp.directive('focus', {
    mounted(el, binding) {
      if (binding.arg) {
        setTimeout(() => {
          el.focus()
        }, Number(binding.arg))
      } else {
        el.focus()
      }
    },
  })
})

export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return

  if (process.client && localStorage.getItem('token')) return

  return navigateTo(`/login?redirectTo=${to.path}`)
})

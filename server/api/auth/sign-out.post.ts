export default defineEventHandler(async (event) => {
  setCookie(event, 'accessToken', '', {
    maxAge: -1,
  })

  return { message: 'Logged out' }
})

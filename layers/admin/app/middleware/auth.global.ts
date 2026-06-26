import { isAdmin, useSession } from '~/entities/session'

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login' || to.path.startsWith('/login/')) {
    return
  }

  const { user, fetchUser, logout } = useSession()

  if (!user.value) {
    await fetchUser()
  }

  if (!user.value) {
    return navigateTo('/login')
  }

  if (!isAdmin(user.value)) {
    await logout()
    return
  }
})

import { useSession } from '~/entities/session'

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login' || to.path.startsWith('/login/')) {
    return
  }

  const { user, fetchUser } = useSession()

  if (!user.value) {
    await fetchUser()
  }

  if (!user.value) {
    return navigateTo('/login')
  }
})

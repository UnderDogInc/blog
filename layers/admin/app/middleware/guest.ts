import { useSession } from '~/entities/session'

export default defineNuxtRouteMiddleware(async () => {
  const { user, fetchUser } = useSession()

  if (!user.value) {
    await fetchUser()
  }

  if (user.value) {
    return navigateTo('/')
  }
})

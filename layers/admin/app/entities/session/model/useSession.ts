import type { User } from './types'
import { isAdmin } from './types'

export const useSession = () => {
  const api = useApi()

  const user = useState<User | null>('user', () => null)
  const loading = useState('session-loading', () => false)

  async function fetchUser() {
    try {
      loading.value = true
      const data = await api<User>('/session/current-user')
      user.value = data
      return data
    } catch {
      user.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  async function clearSession() {
    try {
      await api('/session/logout', { method: 'POST' })
    } catch {
      // Сессия могла уже истечь
    }

    user.value = null
  }

  async function logout() {
    await clearSession()
    await navigateTo('/login')
  }

  async function requireAdmin() {
    if (!user.value) {
      await fetchUser()
    }

    if (!user.value || !isAdmin(user.value)) {
      await logout()
      return false
    }

    return true
  }

  return {
    user,
    loading,
    fetchUser,
    clearSession,
    logout,
    requireAdmin,
    isAdmin: computed(() => isAdmin(user.value))
  }
}

type User = {
  id: number
  phone: string
}

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

  async function logout() {
    await api('/session/logout', { method: 'POST' })
    user.value = null
    await navigateTo('/login')
  }

  return {
    user,
    loading,
    fetchUser,
    logout
  }
}

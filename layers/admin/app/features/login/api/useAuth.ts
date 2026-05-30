import { useSession } from '~/entities/session'

export const useAuth = () => {
  const api = useApi()
  const { fetchUser } = useSession()

  const login = async (payload: { phone: string; password: string }) => {
    await api('/session/login', { method: 'POST', body: payload })
    await fetchUser()
  }

  const logout = async () => {
    await api('/session/logout', { method: 'POST' })
  }

  return {
    login,
    logout
  }
}

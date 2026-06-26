import { isAdmin, useSession } from '~/entities/session'

export const useAuth = () => {
  const api = useApi()
  const { fetchUser, clearSession, user } = useSession()

  const login = async (payload: { phone: string; password: string }) => {
    await api('/session/login', { method: 'POST', body: payload })
    await fetchUser()

    if (!isAdmin(user.value)) {
      await clearSession()
      throw new Error('Доступ только для пользователей с ролью администратора')
    }
  }

  const logoutSession = async () => {
    await api('/session/logout', { method: 'POST' })
  }

  return {
    login,
    logout: logoutSession
  }
}

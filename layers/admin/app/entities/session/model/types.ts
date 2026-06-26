export type UserRole = {
  key: string
  name: string
}

export type User = {
  id: number
  phone: string
  roles?: UserRole[]
}

export const ADMIN_ROLE_KEY = 'admin'

export function hasRole(user: User | null | undefined, roleKey: string): boolean {
  return user?.roles?.some((role) => role.key === roleKey) ?? false
}

export function isAdmin(user: User | null | undefined): boolean {
  return hasRole(user, ADMIN_ROLE_KEY)
}

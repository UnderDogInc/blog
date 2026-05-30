export function useApi() {
  return useNuxtApp().$api
}

export function getApiErrorMessage(error: unknown, fallback = 'Ошибка запроса') {
  return error instanceof Error ? error.message : fallback
}

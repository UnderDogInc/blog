export function useApiFetch<T = unknown>(
  url: MaybeRefOrGetter<string>,
  options: Parameters<typeof useFetch<T>>[1] = {}
) {
  const { $api } = useNuxtApp()

  return useFetch<T>(url, {
    ...options,
    $fetch: $api as typeof $fetch
  })
}

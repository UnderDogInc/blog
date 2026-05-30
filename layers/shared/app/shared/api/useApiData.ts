import type { AsyncDataOptions } from '#app'

export function useApiData<T>(
  key: MaybeRefOrGetter<string>,
  url: MaybeRefOrGetter<string>,
  options?: AsyncDataOptions<T>
) {
  const { $api } = useNuxtApp()

  return useAsyncData<T>(
    key,
    () => $api<T>(toValue(url)),
    options
  )
}
